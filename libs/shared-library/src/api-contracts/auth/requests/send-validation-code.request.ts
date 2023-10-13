import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SendValidationCodeRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
