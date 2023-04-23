import { Controller, Get, Query } from '@nestjs/common';
import { Role } from 'constants/roles';
import { Roles } from 'decorators/roles.decorator';
import { StatisticService } from './statistic.service';
import { StatisticRequest } from './dto/statistic.request.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Roles(Role.ADMIN)
  @Get()
  getAllHistories(@Query() request: StatisticRequest) {
    return this.statisticService.getAllHistories(request);
  }
}
