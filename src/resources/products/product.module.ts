import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { Product, ProductSchema } from './entities/product.entities';
import { S3Service } from 'resources/s3/s3.services';



@Module({
  imports: [
    MongooseModule.forFeature([
        {name:Product.name, schema : ProductSchema}
      ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, S3Service],
  exports: [ProductService, S3Service],
  
})
export class ProductModule {}
