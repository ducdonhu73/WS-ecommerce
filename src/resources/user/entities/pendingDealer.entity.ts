import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address, Position, VehicleInfo, Company } from './dealer.entity';

export type PendingDealerDocument = PendingDealer & Document;

@Schema({ timestamps: true })
export class PendingDealer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ enum: Position })
  position?: Position;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: Company, required: true })
  company: Company;

  @Prop({ type: VehicleInfo, required: true })
  vehicleInfo: VehicleInfo;

  @Prop()
  note?: string;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const PendingDealerSchema = SchemaFactory.createForClass(PendingDealer);
