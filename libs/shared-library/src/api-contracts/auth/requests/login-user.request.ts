import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoginUserRequest {
  @IsNotEmpty()
  @IsNumber()
  username: string;

  @IsNotEmpty()
  password: string;
}
