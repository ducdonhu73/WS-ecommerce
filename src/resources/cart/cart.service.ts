import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartStatus } from './entities/cart.entity';
import { Model } from 'mongoose';
import { AddToCartRequest } from './dto/cart.request.dto';
import { CartResponse } from './dto/cart.response.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private CartModel: Model<Cart>) {}

  async addProductToCart(request: AddToCartRequest): Promise<CartResponse> {
    const { p_id, u_id, quantity } = request;
    const cart = await this.CartModel.findOne({ $and: [{ p_id }, { u_id }, { status: CartStatus.DEPENDING }] });
    if (cart) {
      await cart.updateOne({ $set: { quantity: quantity + cart.quantity } });
    } else {
      await this.CartModel.create({ p_id, u_id, quantity });
    }
    return new CartResponse(cart as Cart);
  }
}
