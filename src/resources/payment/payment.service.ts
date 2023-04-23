import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'resources/products/entities/product.entities';
import { User } from 'resources/user/entities/user.entity';
import { Order } from 'resources/order/entities/order.entity';
import { PaymentRequest } from './dto/payment.request.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async payment(userId: string, request: PaymentRequest): Promise<void> {
    const { order } = request;
    for (let i = 0; i < order.length; i++) {
      const product = order[i]?.product;
      const quantity = order[i]?.quantity;
      if (product && quantity) {
        await this.OrderModel.create({ p_id: product?._id, total: quantity * product?.price, u_id: userId, quantity });
      } else throw new BadRequestException('not found product or quantity');
    }
  }
}
