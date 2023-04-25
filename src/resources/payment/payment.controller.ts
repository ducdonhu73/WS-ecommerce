<<<<<<< HEAD
import { Body, Controller, Post, Get, Param, Query, Res } from '@nestjs/common';
=======
import { Body, Controller, Post, Get } from '@nestjs/common';
>>>>>>> ad23f323d57730d87ac537b83d498679b6116098
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
