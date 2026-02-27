import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionType } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('monthly-summary')
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
  async trends(@Request() req, @Query('months') months?: string) {
    return this.reportsService.trends(req.user.id, months ? parseInt(months) : undefined);
  }

  @Get('budget-alerts')
  async budgetAlerts(@Request() req) {
    return this.reportsService.budgetAlerts(req.user.id);
  }
}
