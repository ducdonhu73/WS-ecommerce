import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { Product, ProductSchema } from './entities/product.entities';



@Module({
  imports: [
    MongooseModule.forFeature([
        {name:Product.name, schema : ProductSchema}
      ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
