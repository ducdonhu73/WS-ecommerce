import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'dtos/pagination.dto';

export class StatisticRequest extends PaginationQuery {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  productId: string;
}
