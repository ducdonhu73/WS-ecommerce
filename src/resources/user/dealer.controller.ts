import { Controller, Get, Body, Put, Delete, Post, Query } from '@nestjs/common';
import { DealerService } from './dealer.service';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'decorators/auth.decorator';
import {
  ApproveDealerRequest,
  ApproveDocumentRequest,
  ChangePasswordRequest,
  DealerResponse,
  DeclineDealerRequest,
  DeleteDealerRequest,
  GetDealerQuery,
  GetPendingDealerQuery,
  LoginDealerRequest,
  LoginResponse,
  PendingDealerResponse,
  RegisterDealerRequest,
  RejectDocumentRequest,
  UpdateDealerRequest,
} from './dto/dealer.dto';
import { PaginationDataResponse } from 'dtos/pagination.dto';
import { ApiPaginatedResponse } from 'decorators/swagger-api-response.decorator';
// import { FastifyRequest } from 'fastify';

@ApiTags('Dealer')
@Controller('dealers')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}

  @Post('register')
  registerDealer(@Body() request: RegisterDealerRequest): Promise<void> {
    return this.dealerService.register(request);
  }

  @Post('login')
  loginDealer(@Body() request: LoginDealerRequest): Promise<LoginResponse> {
    return this.dealerService.login(request);
  }

  @ApiPaginatedResponse(PendingDealerResponse)
  @Get('pending')
  getPendingDealer(@Query() query: GetPendingDealerQuery): Promise<PaginationDataResponse<PendingDealerResponse>> {
    return this.dealerService.getPendingDealers(query);
  }

  @Get()
  getAllDealer(@Query() query: GetDealerQuery): Promise<PaginationDataResponse<DealerResponse>> {
    return this.dealerService.getAllDealers(query);
  }

  @Post('approve')
  approveDealer(@Body() request: ApproveDealerRequest): Promise<DealerResponse> {
    return this.dealerService.approveDealer(request);
  }

  @Post('decline')
  declineDealer(@Body() request: DeclineDealerRequest): Promise<void> {
    return this.dealerService.declineDealer(request);
  }

  @Post('reject-document')
  rejectDocument(@Body() request: RejectDocumentRequest): Promise<void> {
    return this.dealerService.rejectedDocument(request);
  }

  @Post('approve-document')
  approveDocument(@Body() request: ApproveDocumentRequest): Promise<void> {
    return this.dealerService.approvedDocument(request);
  }

  @Post('change-password')
  changePassword(@Body() request: ChangePasswordRequest): Promise<void> {
    return this.dealerService.changePassword(request);
  }

  // @Post('/upload-documents')
  // uploadDocuments(@UserId() userId: string, @Req() req: FastifyRequest) {
  //   return this.dealerService.uploadDocuments(userId, req);
  // }

  /**
   * Lấy thông tin của user
   */
  @Get('me')
  getMyInfo(@UserId() userId: string): Promise<DealerResponse> {
    return this.dealerService.getById(userId);
  }

  /**
   * Sửa thông tin user
   */
  @Put('me')
  updateMyInfo(@UserId() userId: string, @Body() request: UpdateDealerRequest): Promise<DealerResponse> {
    return this.dealerService.update(userId, request);
  }

  @Delete('me/delete')
  deleteUser(@UserId() userId: string, @Body() request: DeleteDealerRequest): Promise<void> {
    return this.dealerService.deleteAccount(userId, request.password);
  }
}
