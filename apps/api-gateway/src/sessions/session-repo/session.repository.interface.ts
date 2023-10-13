import { Session } from '../session.entity';

export interface ISessionRepository {
  createSession(session: Session): Promise<Session>;
  getSessionById(id: number): Promise<Session>;
  getSessions(): Promise<Session[]>;
  updateSession(session: Session): Promise<Session>;
  deleteSession(id: number): Promise<void>;
  getSessionByToken(token: string): Promise<Session>;
}
