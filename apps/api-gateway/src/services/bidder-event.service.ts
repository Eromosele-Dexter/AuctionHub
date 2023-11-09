import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { BID_SERVICE } from '@app/shared-library';
import { SessionRepository } from '../sessions/session-repo/session.repository';

@Injectable()
export class BidderEventService {
  checkout(id: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Inject(BID_SERVICE) private readonly bidClient: ClientProxy,
    private sessionRepository: SessionRepository,
  ) {}

  async hasActiveBid(sessionId: string) {
    // const session = await this.sessionRepository.getSessionById(sessionId);
    // return session.hasActiveBid;
  }

  async onModuleInit() {
    // this.bidClient.subscribeToResponseOf();
    // await this.bidClient.connect();
  }

  async viewWatchList(id: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
