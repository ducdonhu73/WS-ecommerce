import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Document, UpdateQuery } from 'mongoose';

export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export type SellerDocument = Seller & Document;

@Schema({ timestamps: true })
export class Seller {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ sparse: true, unique: true })
  phoneNumber?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: SellerStatus.ACTIVE, enum: SellerStatus, required: true })
  status: SellerStatus;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  idFirebase: string;

  comparePassword: (candidatePassword: string) => Promise<void>;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);

SellerSchema.pre('save', async function () {
  const password = this.get('password') as string;
  const hashed = await hash(password, 10);
  this.set('password', hashed);
});

SellerSchema.pre('updateOne', async function () {
  const update = this.getUpdate() as UpdateQuery<SellerDocument>;
  if (update['password'] && typeof update['password'] === 'string') {
    const password = update['password'];
    const hashed = await hash(password, 10);
    await this.set({ password: hashed });
  }
});

SellerSchema.methods['comparePassword'] = async function (candidatePassword: string) {
  const passwordValid = await compare(candidatePassword, this['password'] as string);

  if (!passwordValid) {
    throw new BadRequestException('Invalid password');
  }
};
