import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getOverview() {
    return this.statsService.getOverview();
  }
}
