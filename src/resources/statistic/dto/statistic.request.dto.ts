import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'dtos/pagination.dto';

export class StatisticRequest extends PaginationQuery {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  productId: string;

  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice: number;
}
