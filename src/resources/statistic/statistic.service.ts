import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from 'resources/order/entities/order.entity';
import { Product } from 'resources/products/entities/product.entities';
import { User } from 'resources/user/entities/user.entity';
import { StatisticRequest } from './dto/statistic.request.dto';
import { mId } from 'utils/helper';
import { StatisticResponse } from './dto/statistic.response.dto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}
  async getAllHistories(request: StatisticRequest): Promise<any> {
    const { userId, productId } = request;
    console.log(userId);
    const filters: FilterQuery<OrderDocument> = {};
    filters.status = OrderStatus.SUCCESS;
    if (userId) filters.u_id = mId(userId);
    if (productId) filters.p_id = mId(productId);
    return (
      await this.OrderModel.aggregate([
        {
          $match: filters,
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
          $lookup: {
            from: 'products',
            as: 'product',
            foreignField: '_id',
            localField: 'p_id',
          },
        },
      ])
    ).map((o) => new StatisticResponse(o as OrderDocument));
  }

  async getHistoriesByUser(userId: string): Promise<any> {
    const filters: FilterQuery<OrderDocument> = {};
    filters.status = OrderStatus.SUCCESS;
    filters.u_id = mId(userId);
    return (
      await this.OrderModel.aggregate([
        {
          $match: filters,
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
          $lookup: {
            from: 'products',
            as: 'product',
            foreignField: '_id',
            localField: 'p_id',
          },
        },
      ])
    ).map((o) => new StatisticResponse(o as OrderDocument));
  }
}
