import { Response } from 'express';

export function formatResponse(
  response: Response,
  status: number,
  message: string,
  data?: any,
): any {
  if (data) {
    return response.status(status).json({
      message: message,
      data: data,
      status: 'success',
    });
  }

  return response.status(status).json({
    message: message,
    error: message,
    status: 'failure',
  });
}
