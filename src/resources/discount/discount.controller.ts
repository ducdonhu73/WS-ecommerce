import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'constants/roles';
import { CreateDiscountRequest } from './dto/discount.dto';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Roles(Role.ADMIN)
  @Get()
  getAllDiscount() {
    return this.discountService.getAllDiscount();
  }

  @Get(':id')
  getDiscount(@Param('id') id: string) {
    return this.discountService.getDiscount(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  createDiscount(@Body() request: CreateDiscountRequest) {
    return this.discountService.createDiscount(request);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteDiscount(@Param('id') id: string) {
    return this.discountService.deleteDiscount(id);
  }
}
