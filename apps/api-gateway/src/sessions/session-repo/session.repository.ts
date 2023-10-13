import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Session } from '../session.entity';
import { ISessionRepository } from './session.repository.interface';
import { ISession } from 'connect-typeorm';

@Injectable()
export class SessionRepository extends Repository<Session> {
  // export class SessionRepository extends Repository<ISession> implements ISessionRepository {
  private readonly logger = new Logger(SessionRepository.name);

  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  async createSession(session: Session): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  async getSessionById(id: number): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  async getSessions(): Promise<Session[]> {
    throw new Error('Method not implemented.');
  }
  async updateSession(session: Session): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  async deleteSession(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getSessionByToken(token: string): Promise<Session> {
    throw new Error('Method not implemented.');
  }
}
