import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;
}
