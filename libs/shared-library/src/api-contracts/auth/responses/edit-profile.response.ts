import { CustomResponse } from '../../response.response';
import { EditProfileUser } from '@app/shared-library/types/editProfileUser';

export class EditProfileResponse extends CustomResponse {
  constructor(
    public readonly data: EditProfileUser,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}
