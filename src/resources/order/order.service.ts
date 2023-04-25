import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'resources/products/entities/product.entities';
import { User } from 'resources/user/entities/user.entity';
import { mId } from 'utils/helper';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderResponse } from './dto/order.response.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async getAllOrder(): Promise<OrderResponse[]> {
    return (
      await this.OrderModel.aggregate([
        {
          $match: { status: OrderStatus.PENDING },
        },
        {
          $lookup: {
            from: 'users',
            as: 'user',
            foreignField: '_id',
            localField: 'u_id',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'products',
            as: 'product',
            foreignField: '_id',
            localField: 'p_id',
          },
        },
        {
          $unwind: '$product',
        },
      ])
    ).map((e) => new OrderResponse(e));
  }
  async approveOrder(orderId: string): Promise<void> {
    const order = await this.OrderModel.findById(orderId);
    if (!order) {
      throw new BadRequestException('Order is not existed');
    }
    await order.updateOne({ status: OrderStatus.SUCCESS });
  }

  async rejectOrder(orderId: string): Promise<void> {
    const order = await this.OrderModel.findById(orderId);
    if (!order) {
      throw new BadRequestException('Order is not existed');
    }
    const product = await this.ProductModel.findById(order.p_id);
    if (!product) throw new BadRequestException('product not exist');
    await product.updateOne({ amount: product.amount + order.quantity });
    await order.updateOne({ status: OrderStatus.FAILD });
  }
}
