import { CustomResponse } from '../../response.response';
import { EditProfileUser } from '@app/shared-library/types/editProfileUser';

export class EditProfileResponse extends CustomResponse {
  constructor(
    public readonly editProfileUser: EditProfileUser,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(editProfileUser, message, status, error);
  }
}
