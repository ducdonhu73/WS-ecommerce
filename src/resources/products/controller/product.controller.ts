import { Controller, Get, Body, Put, Delete, Post, Query, Req, Param} from '@nestjs/common';
import { AddProductRequest, ProductResponse, UpdateProductRequest } from '../dto/product.dto';
import { ProductService } from '../service/product.service';
import { GetProductQuery } from '../entities/product.entities';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

    // @Get('all')
    // allProduct(@Query() query:GetProductQuery): Promise<ProductResponse[]>{
    //     return this.productService.allProduct();
    // }


    @Post('add')
    addProduct(@Body() request: AddProductRequest) : Promise<void>{
        return  this.productService.addProduct(request);
    }

    @Put("update/:_id")
    updateProduct(@Param("_id") id:string, @Body() request:UpdateProductRequest) : Promise<void>{
        return this.productService.updateProduct(id, request);
    }

    @Delete("delete/:_id")
    deleteProduct(@Param("_id") id:string) : Promise<void>{
        return this.productService.deleteProduct(id);
    }

    @Get(":_id")
    getProductById(@Param("_id") id:string) : Promise<ProductResponse>{
        return this.productService.getProductById(id);
    }

    




}

