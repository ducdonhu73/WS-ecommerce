import { Body, Controller, Post } from "@nestjs/common";
import { AddProductRequest, AddProductResponse } from "../dto/product.dto";
import { ProductService } from "../service/product.service";


@Controller('products')
export class ProductController{

    constructor(private readonly productService:ProductService){}

    @Post('add')
    addProduct(@Body() request: AddProductRequest) : Promise<AddProductResponse>{
        return this.productService.addProduct(request);
    }



}