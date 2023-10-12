import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export function formatResponse(response: Response, message: string, data?: any): any {
  if (data) {
    return response.status(HttpStatus.OK).json({
      message: message + ' successful',
      data: data,
      status: 'success',
    });
  }

  return response.status(HttpStatus.BAD_REQUEST).json({
    message: message + ' failed',
    error: message + ' failed',
    status: 'failure',
  });
}
