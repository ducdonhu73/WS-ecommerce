import { Controller, Get, Body, Put, Delete, Post, Query } from '@nestjs/common';
import { SellerService } from './seller.service';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'decorators/auth.decorator';
import {
  ChangePasswordRequest,
  SellerResponse,
  DeleteSellerRequest,
  LoginSellerRequest,
  LoginResponse,
  RegisterSellerRequest,
  UpdateSellerRequest,
  VerifyFirebaseRequest,
  GetSellerQuery,
  LoginFirebaseResponse,
} from './dto/seller.dto';
import { PaginationDataResponse } from 'dtos/pagination.dto';

@ApiTags('Seller')
@Controller('sellers')
export class SellerController {
  constructor(private readonly SellerService: SellerService) {}

  @Post('register')
  registerSeller(@Body() request: RegisterSellerRequest): Promise<SellerResponse> {
    return this.SellerService.register(request);
  }

  @Post('login')
  loginSeller(@Body() request: LoginSellerRequest): Promise<LoginResponse> {
    return this.SellerService.login(request);
  }

  @Post('change-password')
  changePassword(@Body() request: ChangePasswordRequest): Promise<void> {
    return this.SellerService.changePassword(request);
  }
  /*
   * thông tin của user
   */
  @Get('me')
  getMyInfo(@UserId() userId: string): Promise<SellerResponse> {
    return this.SellerService.getById(userId);
  }

  @Get()
  getAllSeller(@Query() query: GetSellerQuery): Promise<PaginationDataResponse<SellerResponse>> {
    return this.SellerService.getAllSellers(query);
  }

  @Put('me')
  updateMyInfo(@UserId() userId: string, @Body() request: UpdateSellerRequest): Promise<SellerResponse> {
    return this.SellerService.update(userId, request);
  }

  @Delete('me/delete')
  deleteUser(@UserId() userId: string, @Body() request: DeleteSellerRequest): Promise<void> {
    return this.SellerService.deleteAccount(userId, request.password);
  }

  @Post('login-firebase')
  verifyLoginFirebase(@Body() request: VerifyFirebaseRequest): Promise<LoginFirebaseResponse> {
    return this.SellerService.loginFirebase(request);
  }
}

