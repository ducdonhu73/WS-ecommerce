import { ProductResponse } from 'resources/products/dto/product.dto';
import { OrderDocument } from '../entities/order.entity';
import { UserResponse } from 'resources/user/dto/user.dto';
import { UserDocument } from 'resources/user/entities/user.entity';
import { ProductDocument } from 'resources/products/entities/product.entities';

export class OrderResponse {
  _id: string;
  user: UserResponse;
  product: ProductResponse;
  quantity: number;
  total: number;
  createdAt: Date;

  constructor(order: OrderDocument) {
    const _order = order as OrderDocument & {
      user: UserResponse;
      product: ProductResponse;
      productImg: string;
    };
    this._id = order._id;
    this.user = new UserResponse(_order.user as UserDocument);
    this.product = new ProductResponse(_order.product as unknown as ProductDocument);
    this.quantity = order.quantity;
    this.total = order.total;
    this.createdAt = order.createdAt;
  }
}
