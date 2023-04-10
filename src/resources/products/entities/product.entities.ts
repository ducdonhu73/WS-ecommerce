import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {

  @Prop({ required: true })
  category_id: string;

  @Prop({ required: true })
  product_name: string;

  @Prop({required: true })
  amount: number;

  @Prop({ required: true})
  price: number;

  @Prop()
  description: Text;

  @Prop()
  image: String;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

