import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment-repo/payment.repository';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}
  getHello(): string {
    return 'Hello World!';
  }
}
