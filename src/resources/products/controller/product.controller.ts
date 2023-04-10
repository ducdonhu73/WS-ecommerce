import { Controller, Get, Body, Put, Delete, Post, Query, Req } from '@nestjs/common';
import { AddProductRequest } from '../dto/product.dto';
import { ProductService } from '../service/product.service';
import { GetProductQuery } from '../entities/product.entities';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Get('all')
  // getAllProduct(@Query() query:GetProductQuery): Promise<>{
  //     return
  // }

  @Post('add')
  addProduct(@Body() request: AddProductRequest): Promise<void> {
    return this.productService.addProduct(request);
  }
}
