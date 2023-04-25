import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Order, OrderSchema } from 'resources/order/entities/order.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './entities/payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymenttModule {}
