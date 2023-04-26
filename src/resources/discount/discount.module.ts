import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './entites/discount.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
