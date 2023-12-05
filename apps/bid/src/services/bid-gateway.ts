import { Logger, OnModuleInit, UseFilters, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { BidService } from './bid.service';
import { SocketWithAuth } from '../types/types';
import { PlaceBidRequest } from '@app/shared-library/api-contracts/bid/requests/place-bid.request';
import { exceptionFactory } from '../middleware/bid-gateway.middleware';
import { STATUS } from '@app/shared-library/types';
import { WsCatchAllFilter } from '../middleware/ws-catch-all-filter.middleware';
import axios from 'axios';
import { API_GATEWAY_PORT } from '@app/shared-library';
import { ConfigService } from '@nestjs/config';
import * as cookieSignature from 'cookie-signature';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: 'bid',
})
export class BidGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  private readonly logger = new Logger(BidGateway.name);
  constructor(
    private readonly bidService: BidService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer() io: Namespace;

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.log(`WS Client with id: ${client.id} connected!`);

    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    const handshake = client.handshake;

    const retrievedCookie = handshake.headers.cookie;

    const decodedCookie = decodeURIComponent(retrievedCookie).replace(/bid_session_id=/g, '');

    console.log('Decoded Cookie: ', decodedCookie);

    if (!decodedCookie.startsWith('s:')) {
      this.disconnectFromBadSession(client);
    }

    const bidSessionId = cookieSignature.unsign(
      decodedCookie.slice(2),
      this.configService.get<string>('SESSION_SECRET'),
    );

    if (!bidSessionId) {
      this.disconnectFromBadSession(client);
    }

    console.log('Bid Session Id: ', bidSessionId);

    // Store the bid_session_id in the client object
    client.data.bidSessionId = bidSessionId;
  }

  async handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.io.emit('goodbye', `from ${client.id}`);

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('place-bid')
  async handlePlaceBid(@ConnectedSocket() client: Socket, @MessageBody() data: PlaceBidRequest) {
    try {
      const validationPipe = new ValidationPipe({ transform: true, exceptionFactory: exceptionFactory });

      const placeBidRequest: PlaceBidRequest = await validationPipe.transform(data, {
        type: 'body',
        metatype: PlaceBidRequest,
      });

      const bidSessionId: string = client.data.bidSessionId;

      // check if user is authenticated and has placed bid by sending a request to the bidder controller in api-gateway by passing user cookie
      // called bid_session_id

      const url = `http://api-gateway:${API_GATEWAY_PORT}/api-gateway/retrieve-session/${bidSessionId}`;

      const retrieveSessionResponse = await axios.get(url);

      if (retrieveSessionResponse.status === 400) {
        this.disconnectFromBadSession(client);
      }

      const bidSession = retrieveSessionResponse.data;

      if (bidSession.error) {
        this.disconnectFromBadSession(client);
      }

      const bidSessionData = bidSession.data;

      const bidIsInvalid =
        bidSessionData.has_active_bid && bidSessionData.listing_item_id !== placeBidRequest.listing_item_id;

      if (bidIsInvalid === undefined || bidIsInvalid === null || bidIsInvalid) {
        client.emit('bidError', {
          error: 'Bid Session Already Active',
          message: 'Bid Session Already Active',
          status: STATUS.FAILED,
        });
        return;
      }

      const response = await this.bidService.handlePlaceBid(placeBidRequest, bidSessionId);

      if (!response) {
        this.io.emit('bid', {
          error: 'Invalid Bid due to either price or item has expired.',
          message: `Bid Failure on item with listing id: ${placeBidRequest.listing_item_id}`,
          status: STATUS.FAILED,
        });
        return;
      }

      this.io.emit('bid', {
        data: response,
        message: `Bid Successfully Placed on item with listing id: ${placeBidRequest.listing_item_id}`,
        status: STATUS.SUCCESS,
      });
    } catch (error) {
      client.emit('bidError', { error: error, message: error.message, status: STATUS.FAILED });
    }
  }

  onModuleInit() {
    // setInterval(() => {
    //     this.checkSessionExpiry();
    // }, 60000); // check every minute
  }

  // private checkSessionExpiry() {
  //     this.io.sockets.forEach(client => {
  //         // const sessionEndTime = // get from session object returned by api-gateway
  //         // if (sessionStartTime && (new Date().getTime() - sessionStartTime.getTime()) > 3600000) { // 1 hour
  //         //     client.disconnect(); // Disconnect the client
  //         // }
  //     });
  // }

  private async disconnectFromBadSession(client: Socket) {
    client.emit('bidError', {
      error: 'No bid Session Found',
      message: 'Unauthorized, Login to Bid',
      status: STATUS.FAILED,
    });
    client.disconnect(); // Disconnect if cookie is not available
  }
}
