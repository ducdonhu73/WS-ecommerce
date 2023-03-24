import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ExceptionFormatter, ResponseFormatter } from 'interceptors/response.interceptor';
import mongoose from 'mongoose';
import { AuctionModule } from 'resources/auction/auction.module';
import { CarModule } from 'resources/car/car.module';
import { UserModule } from 'resources/user/user.module';
import { FirebaseModule } from 'services/firebase/firebase.module';

import { HealthModule } from './resources/health/health.module';
import { MailModule } from './services/mail/mail.module';

mongoose.set('debug', true);

@Module({
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_INTERCEPTOR, useClass: ResponseFormatter },
    { provide: APP_FILTER, useClass: ExceptionFormatter },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env['MONGODB_URL'] || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ScheduleModule.forRoot(),
    FirebaseModule.forRoot(),
    UserModule,
    CarModule,
    AuctionModule,
    HealthModule,
    MailModule,
  ],
})
export class AppModule {}