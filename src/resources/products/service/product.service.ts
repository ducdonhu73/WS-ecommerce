import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../entities/product.entities';
import { Model } from 'mongoose';
import { AddProductRequest, ProductResponse, UpdateProductRequest } from '../dto/product.dto';
import { BadRequestException } from '@nestjs/common';
import { Category, CategoryDocument } from 'resources/categories/category.entities';

export class ProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>,
  ) {}

  async allProduct(): Promise<ProductResponse[]> {
    return this.ProductModel.find();
  }

  async addProduct(request: AddProductRequest): Promise<void> {
    const { category_name, product_name, amount, price, description, image } = request;
    const category = await this.CategoryModel.findOne({ category_name });
    if (!category) throw new BadRequestException('category is not exist');
    await this.ProductModel.create({ category_id: category.id, product_name, amount, price, description, image });
  }

  async updateProduct(productId: string, updateProductRequest: UpdateProductRequest): Promise<void> {
    const { category_id, product_name, amount, price, description, image } = updateProductRequest;
    await this.ProductModel.findByIdAndUpdate(productId, {
      category_id,
      product_name,
      amount,
      price,
      description,
      image,
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.ProductModel.findByIdAndDelete(productId);
  }

  async getProductById(productId: string): Promise<ProductResponse> {
    const product = await this.ProductModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    console.log(product);
    return new ProductResponse(product);
  }
}
