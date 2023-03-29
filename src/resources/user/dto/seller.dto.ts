import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { SellerDocument } from '../entities/seller.entity';
import { QueryFilter } from './user.dto';

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

  @IsOptional()
  idGoogle: string;
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
  isSuccess: boolean;
  constructor(success: boolean) {
    this.isSuccess = success;
  }
}

export class VerifyFirebaseRequest {
  @IsNotEmpty()
  token: string;
}

export class GetSellerQuery extends QueryFilter {}

export class LoginFirebaseResponse {
  accessToken: string;

  @IsOptional()
  message: string;

  constructor(accessToken?: string, message?: string) {
    if (message) this.message = message;
    if (accessToken) this.accessToken = accessToken;
  }
}
