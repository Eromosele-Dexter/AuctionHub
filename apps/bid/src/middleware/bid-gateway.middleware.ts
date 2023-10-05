import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocketWithAuth } from '../types/types';

export const createWSTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      socket.userId = payload.sub;
      //   socket.auctionItemId = payload.auctionItemId;
      socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
