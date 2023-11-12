import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Session } from '../session.entity';

@Injectable()
export class SessionRepository extends Repository<Session> {
  private readonly logger = new Logger(SessionRepository.name);

  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  async createSession(session: Session): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  async getSessionById(id: string): Promise<Session> {
    const session = await this.dataSource.manager.query(`SELECT * FROM sessions WHERE id = '${id}'`);
    return session[0];
  }
  async getSessions(): Promise<Session[]> {
    throw new Error('Method not implemented.');
  }
  async updateSession(session: Session) {
    // const updatedSession = await this.dataSource.manager.query(`UPDATE sessions SET
    // userId = '${session.json.passport.user.id}',
    // token = '${session.token}',
    // expiresAt = '${session.expiresAt}',
    // created_at = '${session.created_at}',
    // updatedAt = '${session.updatedAt}'
    // WHERE id = ${session.id}`);
  }
  async deleteSession(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getSessionByToken(token: string): Promise<Session> {
    throw new Error('Method not implemented.');
  }
}
