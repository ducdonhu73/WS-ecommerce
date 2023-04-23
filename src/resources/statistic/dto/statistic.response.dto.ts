import { ProductResponse } from 'resources/products/dto/product.dto';
import { UserResponse } from 'resources/user/dto/user.dto';
import { OrderDocument } from 'resources/order/entities/order.entity';
import { UserDocument } from 'resources/user/entities/user.entity';
import { ProductDocument } from 'resources/products/entities/product.entities';

export class HistoryResponse {
  product: ProductResponse;
  user: UserResponse;
  total: number;
  date: Date;
  quantity: number;
}

export class StatisticResponse {
  _id: string;
  user: UserResponse;
  product: ProductResponse;
  quantity: number;
  total: number;
  createdAt: Date;

  constructor(order: OrderDocument) {
    const _order = order as OrderDocument & {
      user: UserResponse[];
      product: ProductResponse[];
    };
    this._id = order._id;
    this.user = new UserResponse(_order.user[0] as UserDocument);
    this.product = new ProductResponse(_order.product[0] as unknown as ProductDocument);
    this.quantity = order.quantity;
    this.total = order.total;
    this.createdAt = order.createdAt;
  }
}
