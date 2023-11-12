import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class PaymentDto {
  @IsInt()
  @IsNotEmpty()
  bidderId: number;

  @IsNumber()
  @IsNotEmpty()
  shipmentCost: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  created_at: Date;
}
