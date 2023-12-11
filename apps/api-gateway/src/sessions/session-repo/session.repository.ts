import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Session } from '@app/shared-library';

@Injectable()
export class SessionRepository extends Repository<Session> {
  private readonly logger = new Logger(SessionRepository.name);

  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  async getSessionById(id: string): Promise<Session> {
    const session = await this.dataSource.manager.query(`SELECT * FROM sessions WHERE id = '${id}'`);
    return session[0];
  }

  async updateSessionHasActiveBid(session_id: string, has_active_bid: boolean, listing_item_id: number) {
    console.log(
      'session_id: ',
      session_id,
      'has_active_bid: ',
      has_active_bid,
      'listing_item_id: ',
      listing_item_id,
    );
    const updatedSession = await this.dataSource.manager.query(
      `UPDATE sessions SET has_active_bid = '${has_active_bid}', listing_item_id = ${listing_item_id} WHERE id = '${session_id}'`,
    );
  }

  async updateAllSessionsBiddingOnItem(listing_item_id: number) {
    const updatedSession = await this.dataSource.manager.query(
      `UPDATE sessions SET has_active_bid = false, listing_item_id = null WHERE listing_item_id = ${listing_item_id}`,
    );
  }

  async getSessionByToken(token: string): Promise<Session> {
    throw new Error('Method not implemented.');
  }
}
