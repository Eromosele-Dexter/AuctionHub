import { BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocketWithAuth } from '../types/types';

export function exceptionFactory(errors) {
  const messages = errors.map((error) => Object.values(error.constraints)).join(', ');
  return new BadRequestException(messages);
}
