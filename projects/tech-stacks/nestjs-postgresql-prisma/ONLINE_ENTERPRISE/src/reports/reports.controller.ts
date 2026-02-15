import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily-sales')
  async getDailySales() {
    return this.reportsService.getDailySales();
  }

  @Get('weekly-sales')
  async getWeeklySales() {
    return this.reportsService.getWeeklySales();
  }

  @Get('monthly-sales')
  async getMonthlySales() {
    return this.reportsService.getMonthlySales();
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.reportsService.getTopProducts(parsedLimit);
  }
}
