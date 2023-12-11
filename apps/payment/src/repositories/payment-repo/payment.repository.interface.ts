import { Payment } from '../../../../../libs/shared-library/src/entities/payment/payment.entity';

export interface IPaymentRepository {
  createPayment(payment: Payment): Promise<Payment>;
  getPaymentById(id: number): Promise<Payment>;
  getPayments(): Promise<Payment[]>;
  updatePayment(payment: Payment): Promise<Payment>;
  deletePayment(id: number): Promise<void>;
  getPaymentByUserId(userId: number): Promise<Payment>;
}
