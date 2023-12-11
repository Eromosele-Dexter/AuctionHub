import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IValidationCodeRepository } from './code.repository.interface';
import { ValidationCode } from '../../../../../libs/shared-library/src/entities/auth/validation-code.entity';

@Injectable()
export class ValidationCodeRepository extends Repository<ValidationCode> implements IValidationCodeRepository {
  private readonly logger = new Logger(ValidationCodeRepository.name);

  constructor(private dataSource: DataSource) {
    super(ValidationCode, dataSource.createEntityManager());
  }

  async createValidationCode(validation: ValidationCode) {
    this.dataSource.manager.create(ValidationCode, validation);
    return this.save(validation);
  }

  getValidationCodeByEmail(email: string): Promise<number> {
    const validCode = this.findOne({ where: { email } }).then((validation) => validation.code);
    return validCode;
  }

  async deleteValidationCode(id: number): Promise<void> {
    this.delete(id);
  }
}
