import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ProductResponse } from 'resources/products/dto/product.dto';

class OrderRequest {
  @IsNotEmpty()
  @Type(() => ProductResponse)
  product: ProductResponse;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class PaymentRequest {
  order: OrderRequest[];
  discount: string;
}
