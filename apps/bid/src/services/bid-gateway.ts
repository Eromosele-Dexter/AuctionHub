import { BadRequestException, Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
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

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: 'bid',
})
export class BidGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(BidGateway.name);
  constructor(private readonly bidService: BidService) {}

  @WebSocketServer() io: Namespace;

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    // this.io.emit('hello', `from ${client.id}`);

    // this.io.emit('bid', {
    //   name: client.name,
    //   message: 'Hello from the Bid Service!',
    //   item_id: '123',
    //   end_time: 1536373737,
    //   from_poll: client.id,
    // });

    // const roomName = client.id;

    // await client.join(roomName);

    // const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    // this.logger.debug(`userID: ${client.userId} joined room with name: ${roomName}`);

    // this.logger.debug(`Total clients connected to room '${roomName}': ${connectedClients}`);
  }

  async handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.io.emit('goodbye', `from ${client.id}`);

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('place-bid')
  async handlePlaceBid(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PlaceBidRequest,
  ): Promise<string> {
    try {
      const validationPipe = new ValidationPipe({ transform: true, exceptionFactory: exceptionFactory });
      const bidData = await validationPipe.transform(payload, {
        type: 'body',
        metatype: PlaceBidRequest,
      });
      // const item = await this.itemService.findItemById(bidData.itemId);

      // if (new Date() > item.expirationTime || item.hasBeenSold) {
      //     client.emit('bidError', 'This auction has already ended.');
      //     return;
      // }

      // if (bidData.amount <= item.currentPrice) {
      //     client.emit('bidError', 'Your bid must be greater than the current price.');
      //     return;
      // }

      //TODO: set decrement amount to -1 if it is a forward auction
      console.log('hi from place bid: ', bidData);
      client.emit('bid', { data: bidData, message: 'Bid Successfully Placed', status: STATUS.SUCCESS });
    } catch (error) {
      client.emit('bidError', { error: error, message: error.message, status: STATUS.FAILED });
    }

    return 'Bid received';
  }
}
