import { IsNotEmpty, IsOptional } from 'class-validator';

export class AllProductRequest {}

export class AddProductRequest {
  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  product_name: string;

  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  image: string;
}
