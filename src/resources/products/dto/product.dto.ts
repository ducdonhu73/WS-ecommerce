import { IsNotEmpty, IsOptional } from 'class-validator';
import { ProductDocument } from '../entities/product.entities';
import { Types } from 'mongoose';
import { CategoryDocument } from 'resources/categories/category.entities';

export class AddProductRequest {
  @IsNotEmpty()
  category_name: string;

  @IsNotEmpty()
  product_name: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  image: string;
}

export class AddProductResponse {
  @IsNotEmpty()
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}

export class UpdateProductRequest {
  @IsOptional()
  category_id: string;

  @IsOptional()
  product_name: string;

  @IsOptional()
  amount: number;

  @IsOptional()
  price: number;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;
}

// export class DeleteProductRequest{
//   @IsNotEmpty()
//   id:string
// }

export class ProductResponse {
  id: string;
  category_id: Types.ObjectId;
  category_name: string;
  product_name: string;
  amount: number;
  price: number;
  description?: string;
  image?: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(product: ProductDocument, category?: CategoryDocument) {
    this.id = product.id as string;
    if (category) this.category_name = category.category_name;
    else this.category_id = product.category_id;
    this.product_name = product.product_name;
    this.amount = product.amount;
    this.price = product.price;
    if (product.description) {
      this.description = product.description;
    }
    if (product.image) {
      this.image = product.image;
    }
    this.updatedAt = product.updatedAt;
    this.createdAt = product.createdAt;
  }
}
