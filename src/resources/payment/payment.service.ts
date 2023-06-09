import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'resources/order/entities/order.entity';
import { PaymentRequest } from './dto/payment.request.dto';
import { Payment } from './entities/payment.entity';
import { Product } from 'resources/products/entities/product.entities';
import { Discount } from 'resources/discount/entites/discount.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Payment.name) private PaymentModel: Model<Payment>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
  ) {}

  async payment(userId: string, request: PaymentRequest): Promise<void> {
    const { order, discount } = request;
    let totalB = 0;
    for (let i = 0; i < order.length; i++) {
      const product = order[i]?.product;
      const quantity = order[i]?.quantity;
      if (product && quantity) {
        totalB += product.price * quantity;
        const p = await this.ProductModel.findById(product._id);
        if (!p) throw new BadRequestException();
        await p.updateOne({ amount: p.amount - quantity });
        await this.OrderModel.create({ p_id: product?._id, total: quantity * product?.price, u_id: userId, quantity });
      } else throw new BadRequestException('not found product or quantity');
    }
    const dis = await this.discountModel.findById(discount);
    if (dis && dis.limit > 0) {
      totalB = totalB - (totalB * dis.discountRate) / 100;
      await dis.updateOne({ limit: dis.limit - 1 });
    }
    await this.PaymentModel.create({ total: totalB });
    return;
  }

  async getTotal(): Promise<number> {
    return (await this.PaymentModel.find().sort({ createdAt: -1 })).at(0)?.total as number;
  }
}
