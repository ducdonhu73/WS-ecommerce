import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartRequest, BuyProductRequest } from './dto/cart.request.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  addToCart(@Body() request: AddToCartRequest) {
    return this.cartService.addProductToCart(request);
  }

  @Get(':id')
  getCartByUserId(@Param('id') id: string) {
    return this.cartService.getCartByUserId(id);
  }

  @Post('buy')
  buyProductInCart(@Body() request: BuyProductRequest) {
    return this.cartService.buyProductInCart(request.listCartId);
  }
}
