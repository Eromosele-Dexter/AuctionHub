import { Socket } from 'socket.io';

type AuthPayload = {
  userId: string;
  //   pollID: string;
  name: string;
};

export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;
