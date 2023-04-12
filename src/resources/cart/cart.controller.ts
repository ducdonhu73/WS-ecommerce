import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartRequest } from './dto/cart.request.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  addToCart(@Body() request: AddToCartRequest) {
    return this.cartService.addProductToCart(request);
  }
}
