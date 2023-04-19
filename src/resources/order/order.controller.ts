import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'constants/roles';
import { ApproveOrderRequest } from './dto/order.request.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.ADMIN)
  approveOrder(@Body() request: ApproveOrderRequest) {
    return this.orderService.approveOrder(request.orderId);
  }
}
