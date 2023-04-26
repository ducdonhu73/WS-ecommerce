import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from './entites/discount.entity';
import { Model } from 'mongoose';
import { CreateDiscountRequest } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(@InjectModel(Discount.name) private discountModel: Model<Discount>) {}

  async getAllDiscount(): Promise<any> {
    return await this.discountModel.find({ limit: { $gt: 0 } });
  }

  async getDiscount(id: string): Promise<any> {
    return await this.discountModel.findById(id);
  }

  async createDiscount(request: CreateDiscountRequest): Promise<any> {
    return await this.discountModel.create(request);
  }

  async deleteDiscount(discountId: string): Promise<void> {
    await this.discountModel.findByIdAndDelete(discountId);
  }
}
