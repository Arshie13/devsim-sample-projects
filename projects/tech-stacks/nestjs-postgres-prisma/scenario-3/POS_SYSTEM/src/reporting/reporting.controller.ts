import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
  constructor(private reportingService: ReportingService) {}

  @Get('daily')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get the daily sales report (Admin only)' })
  async getDailyReport() {
    return this.reportingService.getDailyReport();
  }

  @Get('weekly')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get the weekly sales report (Admin only)' })
  async getWeeklyReport() {
    return this.reportingService.getWeeklyReport();
  }
}
