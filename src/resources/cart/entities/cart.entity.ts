import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CartStatus {
  DEPENDING = 'depending',
  BUYED = 'buyed',
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  p_id: string;

  @Prop({ required: true })
  u_id: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: CartStatus.DEPENDING, enum: CartStatus, required: true })
  status: CartStatus;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}
export type CartDocument = Cart & Document;

export const CartSchema = SchemaFactory.createForClass(Cart);
