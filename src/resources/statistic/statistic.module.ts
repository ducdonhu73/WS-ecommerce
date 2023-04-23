import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from 'resources/products/entities/product.entities';
import { User, UserSchema } from 'resources/user/entities/user.entity';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { Order, OrderSchema } from 'resources/order/entities/order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService],
})
export class StatisticModule {}
