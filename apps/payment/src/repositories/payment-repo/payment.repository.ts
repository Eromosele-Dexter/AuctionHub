import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { IPaymentRepository } from './payment.repository.interface';

@Injectable()
export class PaymentRepository
  extends Repository<Payment>
  implements IPaymentRepository
{
  private readonly logger = new Logger(PaymentRepository.name);

  constructor(private dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }

  getPaymentByUserId(userId: number): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
  async createPayment(payment: Payment): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
  async getPaymentById(id: number): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
  async getPayments(): Promise<Payment[]> {
    throw new Error('Method not implemented.');
  }
  async updatePayment(payment: Payment): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
  async deletePayment(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
