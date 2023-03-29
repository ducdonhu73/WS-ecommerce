import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DealerController } from './dealer.controller';
import { DealerService } from './dealer.service';
import { Dealer, DealerSchema } from './entities/dealer.entity';
import { PendingDealer, PendingDealerSchema } from './entities/pendingDealer.entity';
import { Seller, SellerSchema } from './entities/seller.entity';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dealer.name, schema: DealerSchema },
      { name: PendingDealer.name, schema: PendingDealerSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
  ],
  controllers: [DealerController, SellerController],
  providers: [DealerService, SellerService],
  exports: [DealerService, SellerService],
})
export class UserModule {}
