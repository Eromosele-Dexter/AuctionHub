import { Session } from 'apps/api-gateway/src/sessions/session.entity';
import { CustomResponse } from '../../response.response';

export class RetrieveSessionResponse extends CustomResponse {
  constructor(
    public readonly data: Session,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}
