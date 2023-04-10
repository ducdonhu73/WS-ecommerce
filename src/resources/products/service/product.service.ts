import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../entities/product.entities";
import { Model } from "mongoose";
import { AddProductRequest, AddProductResponse } from "../dto/product.dto";




export class ProductService{

    constructor(@InjectModel(Product.name) private ProductModel: Model<Product>){}

    async addProduct(request : AddProductRequest) : Promise<AddProductResponse>{
        const {category_id, product_name, amount, price, description, image} = request
        await this.ProductModel.create({category_id, product_name, amount, price, description, image})
        return new AddProductResponse(true)
    }

}
