import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Discount {
  @Prop({ required: true })
  discountRate: number;

  @Prop({ required: true })
  limit: number;

  @Prop({
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  })
  expireAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}
export type DiscountDocument = Discount & Document;

export const DiscountSchema = SchemaFactory.createForClass(Discount);
