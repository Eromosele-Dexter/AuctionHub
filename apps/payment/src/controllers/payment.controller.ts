import { Controller, Get } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CHECK_OUT_ITEM_MESSAGE_PATTERN, RmqService } from '@app/shared-library';
import CheckOutItemMessage from '@app/shared-library/messages/check-out-item.message';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(CHECK_OUT_ITEM_MESSAGE_PATTERN)
  async handleCheckoutItem(@Payload() data: CheckOutItemMessage, @Ctx() context: RmqContext) {
    const handleCheckoutItemResponse = await this.paymentService.handleCheckoutItem(data);
    this.rmqService.ack(context);
    return handleCheckoutItemResponse;
  }
}
