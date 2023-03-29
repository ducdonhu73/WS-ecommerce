import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from 'dtos/pagination.dto';

export class QueryFilter extends PaginationQuery {
  search?: string;

  @Type(() => Date)
  startDate?: Date;

  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderBy?: number;
}
