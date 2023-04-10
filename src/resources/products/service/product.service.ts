import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../entities/product.entities";
import { Model } from "mongoose";
import { AddProductRequest, AddProductResponse } from "../dto/product.dto";
import { FastifyRequest } from 'fastify';
import { S3Service } from "resources/s3/s3.services";




export class ProductService{

    constructor(@InjectModel(Product.name) private ProductModel: Model<Product>, 
                                            private readonly s3Service: S3Service){}


    async addProduct(request : AddProductRequest) : Promise<void>{
        const {category_id, product_name, amount, price, description, image} = request
        await this.ProductModel.create({category_id, product_name, amount, price, description, image})
    
    }

}
