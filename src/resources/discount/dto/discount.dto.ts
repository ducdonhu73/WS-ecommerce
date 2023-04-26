import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDiscountRequest {
  @IsNotEmpty()
  @IsNumber()
  discountRate: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expireAt: Date;
}
