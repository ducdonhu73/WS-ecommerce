import { Body, Controller, Post, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UserId } from 'decorators/auth.decorator';
import { PaymentRequest } from './dto/payment.request.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  payment(@UserId() userId: string, @Body() request: PaymentRequest) {
    return this.paymentService.payment(userId, request);
  }

  @Get()
  getTotal() {
    return this.paymentService.getTotal();
  }
}
