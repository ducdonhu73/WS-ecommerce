import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { Address, BusinessDocument, Company, DealerDocument, Position, VehicleInfo } from '../entities/dealer.entity';
import { PendingDealerDocument } from '../entities/pendingDealer.entity';
import { QueryFilter } from './user.dto';

export class UpdateDealerRequest {
  @IsOptional()
  @Length(1, 255)
  name: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsOptional()
  @Type(() => Address)
  address: Address;

  @IsOptional()
  @Type(() => Company)
  company: Company;

  @IsOptional()
  @Type(() => VehicleInfo)
  vehicleInfo: VehicleInfo;

  @IsOptional()
  @IsString()
  note?: string;
}

export class DeleteDealerRequest {
  @IsNotEmpty()
  password: string;
}

export class DealerResponse {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  company: Company;
  address: Address;
  vehicleInfo: VehicleInfo;
  businessDocument: BusinessDocument;
  updatedAt: Date;
  createdAt: Date;

  constructor(user: DealerDocument) {
    this.id = user.id as string;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    if (user.email) {
      this.email = user.email;
    }
    this.address = user.address;
    this.company = user.company;
    this.vehicleInfo = user.vehicleInfo;
    this.businessDocument = user.businessDocument;
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
  }
}

export class RegisterDealerRequest {
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsNotEmpty()
  @Type(() => Address)
  address: Address;

  @IsNotEmpty()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty()
  @Type(() => VehicleInfo)
  vehicleInfo: VehicleInfo;

  @IsOptional()
  @IsString()
  note?: string;
}

export class LoginDealerRequest {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class PendingDealerResponse {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  company: Company;
  address: Address;
  vehicleInfo: VehicleInfo;
  note?: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(user: PendingDealerDocument) {
    this.id = user.id as string;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    if (user.email) {
      this.email = user.email;
    }
    this.address = user.address;
    this.company = user.company;
    this.vehicleInfo = user.vehicleInfo;
    if (user.note) {
      this.note = user.note;
    }
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
  }
}

export class GetPendingDealerQuery extends QueryFilter {}

export class GetDealerQuery extends QueryFilter {}

export class ApproveDealerRequest {
  @IsNotEmpty()
  @IsString()
  pendingDealerId: string;
}

export class DeclineDealerRequest {
  @IsNotEmpty()
  @IsString()
  pendingDealerId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
export class ChangePasswordRequest {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(6, 20)
  oldPassword: string;

  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;
}

export class ApproveDocumentRequest {
  @IsNotEmpty()
  @IsString()
  dealerId: string;
}

export class RejectDocumentRequest {
  @IsNotEmpty()
  @IsString()
  dealerId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
