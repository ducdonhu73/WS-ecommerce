import { SellerResponse } from 'resources/user/dto/user.dto';
import { ProductResponse } from 'resources/products/dto/product.dto';
import { CartDocument } from '../entities/cart.entity';
import { SellerDocument } from 'resources/user/entities/user.entity';
import { ProductDocument } from 'resources/products/entities/product.entities';

export class CartResponse {
  user: SellerResponse;
  product: ProductResponse;
  quantity: number;

  constructor(cart?: CartDocument, user?: SellerDocument, product?: ProductDocument) {
    if (user) this.user = new SellerResponse(user);
    if (product) this.product = new ProductResponse(product);
    if (cart) this.quantity = cart.quantity;
  }

  constructor2(cart: CartResponse) {
    this.user = cart.user;
    this.quantity = cart.quantity;
    this.product = cart.product;
    return this;
  }
}
