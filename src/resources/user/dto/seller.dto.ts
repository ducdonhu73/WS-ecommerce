import { Type } from 'class-transformer';
import { isNotEmpty, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { PaginationQuery } from 'dtos/pagination.dto';

import { SellerDocument } from '../entities/seller.entity';

export class CreateSellerRequest {
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}

export class UpdateSellerRequest {
  @IsOptional()
  @Length(0, 255)
  firstName?: string;

  @IsOptional()
  @Length(0, 255)
  lastName?: string;

  @IsOptional()
  @Length(0, 255)
  email?: string;
}

export class DeleteSellerRequest {
  @IsNotEmpty()
  password: string;
}

export class SellerResponse {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  updatedAt: Date;
  createdAt: Date;
  idGoogle?: string

  constructor(user: SellerDocument) {
    this.id = user.id as string;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    if (user.phoneNumber) this.phoneNumber = user.phoneNumber;
    if (user.email) {
      this.email = user.email;
    }
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
    if (user.idGoogle) this.idGoogle = user.idGoogle
  }
}

export class RegisterSellerRequest {
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  @Length(1, 255)
  email: string;
}

export class LoginSellerRequest {
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

export class ChangePasswordResponse {
  @IsNotEmpty()
  isSuccess: boolean
  constructor(success: boolean) {
    this.isSuccess = success
  }
}

export class VerifyFirebaseRequest {
  @IsNotEmpty()
  token: string;
}

export class GetSellerQuery extends PaginationQuery {
  search?: string;

  @Type(() => Date)
  startDate?: Date;

  @Type(() => Date)
  endDate?: Date;

  sortBy?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;
}

export class LoginFirebaseResponse {
  @IsOptional()
  password: string;

  @IsOptional()
  message: string;

  @IsOptional()
  token: string;

  constructor(password?: string, message?: string, token?: string) {
    if (password) this.password = password;
    if (message) this.message = message;
    if (token) this.token = token;
  }
}
