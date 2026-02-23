import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
  constructor(private reportingService: ReportingService) {}

  // TODO: Implement daily and weekly sales reporting (Level 4)
  @Get('daily')
  @Roles(UserRole.ADMIN)
  async getDailyReport() {
    return this.reportingService.getDailyReport();
  }

  @Get('weekly')
  @Roles(UserRole.ADMIN)
  async getWeeklyReport() {
    return this.reportingService.getWeeklyReport();
  }
}
