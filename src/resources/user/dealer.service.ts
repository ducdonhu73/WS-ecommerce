import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  ApproveDealerRequest,
  ApproveDocumentRequest,
  ChangePasswordRequest,
  DealerResponse,
  DeclineDealerRequest,
  GetDealerQuery,
  GetPendingDealerQuery,
  LoginDealerRequest,
  LoginResponse,
  PendingDealerResponse,
  RegisterDealerRequest,
  RejectDocumentRequest,
  UpdateDealerRequest,
} from './dto/dealer.dto';
import { Dealer, DealerStatus, DealerDocument, DocumentFile, BusinessDocumentStatus } from './entities/dealer.entity';
import jwt from 'jsonwebtoken';
import { PendingDealer, PendingDealerDocument } from './entities/pendingDealer.entity';
import { PaginationDataResponse, PaginationQuery } from 'dtos/pagination.dto';
import { Role } from 'constants/roles';
import { FastifyRequest } from 'fastify';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MailService } from 'services/mail/mail.service';

@Injectable()
export class DealerService {
  constructor(
    @InjectModel(Dealer.name) private dealerModel: Model<Dealer>,
    @InjectModel(PendingDealer.name) private pendingDealerModel: Model<PendingDealer>,
    @Inject(MailService) private mailService: MailService,
  ) {}

  private readonly logger = new Logger(DealerService.name);

  async register(request: RegisterDealerRequest): Promise<void> {
    const filter = { $or: [{ phoneNumber: request.phoneNumber }, { email: request.email }] };
    const pendingDealer = await this.pendingDealerModel.findOne(filter).exec();
    const dealer = await this.dealerModel.findOne(filter).exec();
    if (pendingDealer || dealer) {
      throw new BadRequestException('Phone number exist');
    }
    await this.pendingDealerModel.create({ ...request });
  }

  async login(request: LoginDealerRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.dealerModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('No User found');
    }

    await user.comparePassword(password);

    if (user.status === DealerStatus.INACTIVE) {
      throw new BadRequestException('Dealer is inactive');
    }

    if (user.status === DealerStatus.DELETED) {
      throw new BadRequestException('Dealer is deleted');
    }
    // const authToken = await this.auth.createCustomToken(user.id as string);

    const authToken = this.createToken(user.id as string);
    return new LoginResponse(authToken);
  }

  async getPendingDealers(query: GetPendingDealerQuery): Promise<PaginationDataResponse<PendingDealerResponse>> {
    const { page, limit, search, startDate, endDate, sortBy, orderBy="createdAt" } = query;
    let user: PendingDealerDocument[] = [];
    let total = 0;

    let filter: FilterQuery<PendingDealerDocument> = {};

    if (search) {
      filter.name = { $regex: new RegExp(`^${search}`, 'i') };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate)
      }
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate)
      }
    }

    total = await this.pendingDealerModel.find(filter).count();
    user = await this.pendingDealerModel
    .find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [orderBy]: Number(sortBy)>0 ? 1 : -1})
    const response = user.map((u) => new PendingDealerResponse(u));

    return new PaginationDataResponse(response, { page, limit, total });
  }

  async getAllDealers(query: GetDealerQuery): Promise<PaginationDataResponse<DealerResponse>> {
    const { page, limit, search, startDate, endDate, sortBy, orderBy="createdAt" } = query;
    let listDealer: DealerDocument[] = [];
    const filter: FilterQuery<DealerDocument> = {};

    if (search) {
      filter.name = { $regex: new RegExp(`^${search}`, 'i') };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate)
      }
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate)
      }
    }

    listDealer = await this.dealerModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [orderBy]: Number(sortBy)>0 ? 1 : -1})
      const response = listDealer.map((dealer) => new DealerResponse(dealer));
    const total = listDealer.length
    return new PaginationDataResponse(response, { page, limit, total });
  }

  async approveDealer(request: ApproveDealerRequest): Promise<DealerResponse> {
    const pendingDealer = await this.pendingDealerModel.findById(request.pendingDealerId).exec();

    if (!pendingDealer) {
      throw new BadRequestException('Pending dealer not found');
    }

    const { phoneNumber, email, name, address, company, vehicleInfo } = pendingDealer;

    const password = Math.random().toString(36).substring(2, 8);

    const newDealer = await this.dealerModel.create({
      name,
      phoneNumber,
      email,
      password,
      isNewDealer: true,
      address,
      company,
      vehicleInfo,
    });

    if (newDealer) {
      pendingDealer.delete();
    }

    await this.mailService.sendApproveDealerMail(email, {
      name: name,
      loginLink: 'https://gear.teklabs.vn',
    });
    return new DealerResponse(newDealer);
  }

  async declineDealer(request: DeclineDealerRequest): Promise<void> {
    const pendingDealer = await this.pendingDealerModel.findById(request.pendingDealerId).exec();

    if (!pendingDealer) {
      throw new BadRequestException('Pending dealer not found');
    }

    await pendingDealer.delete();
    await this.mailService.sendRejectDealerMail(pendingDealer.email, {
      name: pendingDealer.name,
    });
  }

  async changePassword(changePasswordRequest: ChangePasswordRequest): Promise<void> {
    const { phoneNumber, oldPassword, newPassword } = changePasswordRequest;

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    const dealer = await this.dealerModel.findOne({ phoneNumber }).exec();
    if (!dealer) {
      throw new BadRequestException();
    }

    if (!dealer.isNewDealer) {
      await dealer.comparePassword(oldPassword);
    }

    await dealer.updateOne({ password: newPassword, isNewDealer: false });
  }

  async getById(userId: string): Promise<DealerResponse> {
    const user = await this.dealerModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new DealerResponse(user);
  }

  async update(userId: string, updateUserRequest: UpdateDealerRequest): Promise<DealerResponse> {
    const user = await this.dealerModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.update(updateUserRequest);
    return new DealerResponse(user);
  }

  async approvedDocument(request: ApproveDocumentRequest): Promise<void> {
    const { dealerId } = request
    await this.updateDocumentStatus(dealerId, true)
  }

  async rejectedDocument(request: RejectDocumentRequest): Promise<void> {
    const { dealerId, message } = request
    await this.updateDocumentStatus(dealerId, false)
    // to do send email reason reject
  }

  private async updateDocumentStatus(dealerId: string, accept: boolean) {
    await this.dealerModel.findByIdAndUpdate(
      dealerId, 
      {$set: { "businessDocument.status": accept? BusinessDocumentStatus.APPROVED : BusinessDocumentStatus.REJECTED }}
    )
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await this.dealerModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.comparePassword(password);
    await user.updateOne({ status: DealerStatus.DELETED });
  }

  async uploadDocuments(userId: string, req: FastifyRequest): Promise<void> {
    if (!req.isMultipart) {
      throw new BadRequestException('Request is not multipart');
    }
    const files = req.files();
    const s3Client = new S3Client({
      region: 'ap-southeast-2',
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
      },
    });

    const documents: DocumentFile[] = [];
    for await (const file of files) {
      const buffer = await file.toBuffer();
      const key = 'dealer/' + userId + '/documents/' + file.filename;
      // TODO: move to a new service
      await s3Client.send(
        new PutObjectCommand({
          Bucket: 'gear-nz',
          Key: key,
          ACL: 'public-read',
          Body: buffer,
          ContentType: file.mimetype,
        }),
      );
      const path = `https://gear-nz.s3.ap-southeast-2.amazonaws.com/${key}`;
      documents.push({
        name: key,
        path,
        mimetype: file.mimetype,
      });
    }

    await this.dealerModel.findByIdAndUpdate(
      { _id: userId },
      { businessDocument: { files: documents, status: BusinessDocumentStatus.PENDING } },
    );
  }

  private createToken(userId: string): string {
    const secretKey = process.env['JWT_SECRET'];

    if (!secretKey) {
      throw new BadRequestException('Secret key not found');
    }

    return jwt.sign(
      {
        id: userId,
        role: Role.DEALER,
      },
      secretKey,
    );
  }
}
