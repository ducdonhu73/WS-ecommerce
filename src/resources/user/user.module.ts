import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Seller, SellerSchema } from './entities/user.entity';
import { SellerController } from './user.controller';
import { SellerService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }])],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class UserModule {}
