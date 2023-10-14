import { ValidationCode } from '../../entities/validation-code.entity';

export interface IValidationCodeRepository {
  createValidationCode(validation: ValidationCode): Promise<ValidationCode>;
  getValidationCodeByEmail(email: string): Promise<number>;
  deleteValidationCode(id: number): Promise<void>;
}
