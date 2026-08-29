import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionType } from '@prisma/client';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('monthly-summary')
  @ApiOperation({ summary: 'Get monthly summary report' })
  @ApiQuery({ name: 'month', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: String })
  async monthlySummary(
    @Request() req,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.reportsService.monthlySummary(
      req.user.id,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('category-breakdown')
  @ApiOperation({ summary: 'Get category breakdown report' })
  @ApiQuery({ name: 'month', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' })
  async categoryBreakdown(
    @Request() req,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('type') type?: TransactionType,
  ) {
    return this.reportsService.categoryBreakdown(
      req.user.id,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
      type || TransactionType.EXPENSE,
    );
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get spending trends over time' })
  @ApiQuery({ name: 'months', required: false, type: String })
  async trends(@Request() req, @Query('months') months?: string) {
    return this.reportsService.trends(req.user.id, months ? parseInt(months) : undefined);
  }

  @Get('budget-alerts')
  @ApiOperation({ summary: 'Get budget alerts for the user' })
  async budgetAlerts(@Request() req) {
    return this.reportsService.budgetAlerts(req.user.id);
  }
}
