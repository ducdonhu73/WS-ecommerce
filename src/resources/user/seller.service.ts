import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  ChangePasswordRequest,
  SellerResponse,
  LoginSellerRequest,
  LoginResponse,
  RegisterSellerRequest,
  UpdateSellerRequest,
  VerifyFirebaseRequest,
  GetSellerQuery,
  LoginFirebaseResponse,
} from './dto/seller.dto';
import { Seller, SellerDocument, SellerStatus } from './entities/seller.entity';
import jwt from 'jsonwebtoken';
import { Role } from 'constants/roles';
import { getAuth } from 'firebase-admin/auth';
import { PaginationDataResponse } from 'dtos/pagination.dto';

@Injectable()
export class SellerService {
  constructor(@InjectModel(Seller.name) private SellerModel: Model<Seller>) {}

  async register(request: RegisterSellerRequest): Promise<LoginResponse> {
    const filter = { phoneNumber: request.phoneNumber };
    const Seller = await this.SellerModel.findOne(filter).exec();
    if (Seller) {
      throw new BadRequestException('Phone number exist');
    }
    const { firstName, lastName, phoneNumber, email, password, confirmPassword, idGoogle } = request;
    if (confirmPassword !== password) throw new BadRequestException('Passwords are not the same!');
    const newSeller = await this.SellerModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      idGoogle,
    });
    const authToken = this.createToken(newSeller.id as string);
    return new LoginResponse(authToken);
  }

  async login(request: LoginSellerRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.SellerModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('No User found');
    }

    await user.comparePassword(password);

    if (user.status === SellerStatus.INACTIVE) {
      throw new BadRequestException('Seller is inactive');
    }

    if (user.status === SellerStatus.DELETED) {
      throw new BadRequestException('Seller is deleted');
    }
    // const authToken = await this.auth.createCustomToken(user.id as string);

    const authToken = this.createToken(user.id as string);
    return new LoginResponse(authToken);
  }

  async getAllSellers(query: GetSellerQuery): Promise<PaginationDataResponse<SellerResponse>> {
    const { page, limit, search, startDate, endDate, orderBy = 1, sortBy = 'createdAt' } = query;
    let listSeller: SellerDocument[] = [];
    const filter: FilterQuery<SellerDocument> = {};

    if (search) {
      filter.firstName = { $regex: new RegExp(`^${search}`, 'i') };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    listSeller = await this.SellerModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: orderBy < 0 ? 1 : -1 });
    const response = listSeller.map((Seller) => new SellerResponse(Seller));
    const total = listSeller.length;
    return new PaginationDataResponse(response, { page, limit, total });
  }

  async changePassword(changePasswordRequest: ChangePasswordRequest): Promise<void> {
    const { phoneNumber, oldPassword, newPassword } = changePasswordRequest;

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    const seller = await this.SellerModel.findOne({ phoneNumber }).exec();
    if (!seller) {
      throw new BadRequestException('dont find seller by phonenumber');
    }
    await seller.comparePassword(oldPassword);
    await seller.updateOne({ password: newPassword });
    console.log('end');
  }

  async getById(userId: string): Promise<SellerResponse> {
    const user = await this.SellerModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new SellerResponse(user);
  }

  async updateSeller(userId: string, updateUserRequest: UpdateSellerRequest): Promise<SellerResponse> {
    const user = await this.SellerModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.updateOne(updateUserRequest);
    return new SellerResponse(user);
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await this.SellerModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.comparePassword(password);
    await user.updateOne({ status: SellerStatus.DELETED });
  }

  private createToken(userId: string): string {
    const secretKey = process.env['JWT_SECRET'];

    if (!secretKey) {
      throw new BadRequestException('Secret key not found');
    }

    return jwt.sign(
      {
        id: userId,
        role: Role.SELLER,
      },
      secretKey,
    );
  }

  async loginFirebase(request: VerifyFirebaseRequest): Promise<LoginFirebaseResponse> {
    const { token } = request;
    const decodedToken = await getAuth().verifyIdToken(token);
    const {
      email,
      uid,
      phone_number,
      name,
      firebase: { sign_in_provider },
    } = decodedToken;
    if (!email) throw new BadRequestException('verify failed!');
    const seller = await this.SellerModel.findOne({ idFirebase: uid });
    if (seller) {
      const message: string = 'login with ' + sign_in_provider + ' success!';
      const authToken = this.createToken(seller.id as string);
      return new LoginFirebaseResponse(authToken, message);
    }

    const sellerFindByEmail = await this.SellerModel.findOne({ email: email });
    if (sellerFindByEmail) throw new BadRequestException('Email exist');
    const sellerFindByPhone = await this.SellerModel.findOne({
      phoneNumber: phone_number,
    });
    if (sellerFindByPhone) throw new BadRequestException('Phone exist');

    const password = Math.round(Math.random() * 100000000).toString();
    const nameArray = (name as string).split(' ');
    const newSeller = await this.SellerModel.create({
      firstName: nameArray[0],
      lastName: nameArray.slice(1).join(' '),
      phoneNumber: phone_number,
      email,
      password,
      idFirebase: uid,
    });
    const authToken = this.createToken(newSeller.id as string);
    return new LoginFirebaseResponse(authToken, 'Created new seller account with ' + sign_in_provider);
  }
}
