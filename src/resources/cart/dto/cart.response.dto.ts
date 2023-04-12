import { Cart } from '../entities/cart.entity';

export class CartResponse {
  u_id: string;
  p_id: string;
  quantity: number;

  constructor(cart: Cart) {
    this.u_id = cart.u_id;
    this.p_id = cart.p_id;
    this.quantity = cart.quantity;
  }
}
