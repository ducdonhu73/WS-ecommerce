import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cart, CartSchema } from './entities/cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Product, ProductSchema } from 'resources/products/entities/product.entities';
import { Seller, SellerSchema } from 'resources/user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
