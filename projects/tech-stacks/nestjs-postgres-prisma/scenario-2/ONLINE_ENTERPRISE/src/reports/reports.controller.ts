import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily-sales')
  @ApiOperation({ summary: 'Get daily sales report (Admin only)' })
  async getDailySales() {
    return this.reportsService.getDailySales();
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily sales report alias (Admin only)' })
  async getDaily() {
    return this.reportsService.getDailySales();
  }

  @Get('weekly-sales')
  @ApiOperation({ summary: 'Get weekly sales report (Admin only)' })
  async getWeeklySales() {
    return this.reportsService.getWeeklySales();
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly sales report alias (Admin only)' })
  async getWeekly() {
    return this.reportsService.getWeeklySales();
  }

  @Get('monthly-sales')
  @ApiOperation({ summary: 'Get monthly sales report (Admin only)' })
  async getMonthlySales() {
    return this.reportsService.getMonthlySales();
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top-selling products (Admin only)' })
  @ApiQuery({ name: 'limit', required: false, type: String })
  async getTopProducts(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.reportsService.getTopProducts(parsedLimit);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock (Admin only)' })
  @ApiQuery({ name: 'threshold', required: false, type: String })
  async getLowStock(@Query('threshold') threshold?: string) {
    const parsedThreshold = threshold ? parseInt(threshold, 10) : 10;
    return this.reportsService.getLowStock(parsedThreshold);
  }
}
