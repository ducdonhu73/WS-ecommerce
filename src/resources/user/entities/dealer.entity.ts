import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { CallbackWithoutResultAndOptionalError, Document, UpdateQuery } from 'mongoose';

class Range {
  min: number;
  max: number;
}

export enum Position {
  sale = 'Sale',
}

export class Address {
  lineOne: string;
  lineTwo: string;
  city: string;
  postCode: string;
}

export class Company {
  name: string;
  type: string;
  phoneNumber: string;
  website: string;
}

export class VehicleInfo {
  value: Range;
  age: Range;
  mileage: Range;
  quantity: number;
  distance: number;
}

export class DocumentFile {
  name: string;
  path: string;
  mimetype: string;
}

export enum BusinessDocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class BusinessDocument {
  files: DocumentFile[];
  status: BusinessDocumentStatus;
}

export enum DealerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export type DealerDocument = Dealer & Document;

@Schema({ timestamps: true })
export class Dealer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: DealerStatus.ACTIVE, enum: DealerStatus, required: true })
  status: DealerStatus;

  @Prop({ default: true, required: true })
  isNewDealer: boolean;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: Company, required: true })
  company: Company;

  @Prop({ type: VehicleInfo, required: true })
  vehicleInfo: VehicleInfo;

  @Prop({ type: BusinessDocument })
  businessDocument: BusinessDocument;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;

  comparePassword: (candidatePassword: string) => Promise<void>;
}

export const DealerSchema = SchemaFactory.createForClass(Dealer);

DealerSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
  const password = this.get('password') as string;
  const hashed = await hash(password, 10);
  this.set('password', hashed);

  next();
});

DealerSchema.pre('updateOne', async function (next: CallbackWithoutResultAndOptionalError) {
  const update = this.getUpdate() as UpdateQuery<DealerDocument>;
  if (update['password'] && typeof update['password'] === 'string') {
    const password = update['password'];
    const hashed = await hash(password, 10);
    void this.set('password', hashed);
  }

  next();
});

DealerSchema.methods['comparePassword'] = async function (candidatePassword: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const passwordValid = await compare(candidatePassword, this['password']);

  if (!passwordValid) {
    throw new BadRequestException('Invalid password');
  }
};
