import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repo/user.repository';
import { User } from '../entities/user.entity';
import { ROLES, STATUS } from '@app/shared-library/types';
import { LoginUserResponse, RegisterUserResponse } from '@app/shared-library';
import RegisterUserMessage from '@app/shared-library/messages/register-user.message';
import SendValidationCodeEvent from '@app/shared-library/events/send-validation-code.event';
import * as sgMail from '@sendgrid/mail';
import { SendGridService } from './sendgrid.service';
import { ValidationCodeRepository } from '../repositories/validation-codes-repo/code.repository';
import { ValidationCode } from '../entities/validation-code.entity';
import { ResetPasswordResponse } from '@app/shared-library/api-contracts/auth/responses/reset-password.response';
import ResetPasswordMessage from '@app/shared-library/messages/reset-password.message';
import { generateValidationCode } from '../utils/generateCode';
import { VALIDATION_CODE_EMAIL_SUBJECT, validationCodeEmailFormat } from '../utils/emailformats';
import EditProfileMessage from '@app/shared-library/messages/edit-profile.message';
import { EditProfileResponse } from '@app/shared-library/api-contracts/auth/responses/edit-profile.response';
import GetUsersMessage from '@app/shared-library/messages/get-users.message';
import { GetUsersResponse } from '@app/shared-library/api-contracts/auth/responses/get-users.response';
import { GetSingleUserResponse } from '@app/shared-library/api-contracts/auth/responses/get-single-user.response';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private validationCodeRepository: ValidationCodeRepository,
    private sendGridService: SendGridService,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async handleRegisterUser(registerUserMessage: RegisterUserMessage): Promise<RegisterUserResponse> {
    const user = new User(
      registerUserMessage.first_name,
      registerUserMessage.last_name,
      registerUserMessage.username,
      registerUserMessage.password,
      registerUserMessage.email,
      registerUserMessage.isSeller ? ROLES.SELLER : ROLES.BUYER,
      registerUserMessage.street_name,
      registerUserMessage.street_number,
      registerUserMessage.postal_code,
      registerUserMessage.city,
      registerUserMessage.country,
      registerUserMessage.dateRegistered,
    );

    const usernameExists = await this.userRepository.getUserByUsername(user.username);

    const emailExists = await this.userRepository.getUserByEmail(user.email);

    if (usernameExists) {
      return new RegisterUserResponse(
        null,
        `User with username '${user.username}' already exists`,
        STATUS.FAILED,
        'Error registering user',
      );
    }

    if (emailExists) {
      return new RegisterUserResponse(
        null,
        `User with email '${user.email}' already exists`,
        STATUS.FAILED,
        'Error registering user',
      );
    }

    this.userRepository.createUser(user);

    //TODO: send welcome email
    return new RegisterUserResponse(user, 'User created', STATUS.SUCCESS);
  }

  async validateUser(username: string, password: string): Promise<LoginUserResponse> {
    const user: User = await this.userRepository.getUserByUsername(username);
    // const isMatch = await bcrypt.compare(password, user.password);
    if (user && user.password === password) {
      // TODO: use bcrypt to compare passwords instead
      return new LoginUserResponse(user, 'User validated', STATUS.SUCCESS);
    }

    return new LoginUserResponse(null, "User doesn't exist", STATUS.FAILED, 'Error validating user');
  }

  async handleSendValidationCode(sendValidationCodeEvent: SendValidationCodeEvent) {
    const userExists = await this.userRepository.getUserByEmail(sendValidationCodeEvent.email);

    if (userExists) {
      const emailToSendCode = sendValidationCodeEvent.email;

      const validationCode = generateValidationCode();

      const username = userExists.username;

      const validation = new ValidationCode(emailToSendCode, validationCode);

      await this.validationCodeRepository.createValidationCode(validation);

      this.sendGridService.sendEmail(
        sendValidationCodeEvent.email,
        VALIDATION_CODE_EMAIL_SUBJECT,
        validationCodeEmailFormat(username, validationCode),
        validationCodeEmailFormat(username, validationCode, true),
      );
    }
  }

  async handleResetPassword(ResetPasswordMessage: ResetPasswordMessage): Promise<ResetPasswordResponse> {
    const { email, code, newPassword } = ResetPasswordMessage;

    const validationCode = await this.validationCodeRepository.getValidationCodeByEmail(email);

    if (validationCode !== code) {
      return new ResetPasswordResponse(null, 'Wrong validation code', STATUS.FAILED, 'Error resetting password');
    }

    const user = await this.userRepository.getUserByEmail(email);

    user.password = newPassword;

    await this.userRepository.updateUser(user);

    // TODO: delete validation code associated with email from db

    return new ResetPasswordResponse(user, 'Password successfully reset', STATUS.SUCCESS);
  }

  async handleEditProfile(data: EditProfileMessage): Promise<EditProfileResponse> {
    const {
      userId,
      first_name,
      last_name,
      username,
      email,
      street_name,
      street_number,
      postal_code,
      city,
      country,
      updated_at,
    } = data;

    const user = await this.userRepository.getUserById(userId);

    // not possible for user not to be found, but just in case
    if (!user) {
      return new EditProfileResponse(null, 'User not found', STATUS.FAILED, 'Error editing profile');
    }

    user.first_name = first_name;
    user.last_name = last_name;
    user.username = username;
    user.email = email;
    user.street_name = street_name;
    user.street_number = street_number;
    user.postal_code = postal_code;
    user.city = city;
    user.country = country;
    user.updated_at = updated_at;

    await this.userRepository.updateUser(user);

    return new EditProfileResponse(user, 'Profile successfully edited', STATUS.SUCCESS);
  }

  async handleGetUsersByIds(data: GetUsersMessage): Promise<GetUsersResponse> {
    const { userIds } = data;

    const users = await this.userRepository.getUsersByIds(userIds);

    return new GetUsersResponse(users, 'Users retrieved successfully', STATUS.SUCCESS);
  }

  async handleGetSingleUser(user_id: number): Promise<GetSingleUserResponse> {
    const user = await this.userRepository.getUserById(user_id);

    return new GetSingleUserResponse(user, 'User retrieved successfully', STATUS.SUCCESS);
  }
}
