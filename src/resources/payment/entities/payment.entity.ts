import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop()
  total: number;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}
export type PaymentDocument = Payment & Document;

export const PaymentSchema = SchemaFactory.createForClass(Payment);
