import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportingService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement daily sales report (Level 4, Task 4.1)
  // Should return:
  // - Total sales amount
  // - Total order count
  // - Top 5 selling products
  async getDailyReport() {
    throw new Error('Not implemented: Daily sales report');
  }

  // TODO: Implement weekly sales report (Level 4, Task 4.2)
  // Should aggregate last 7 days of sales data
  async getWeeklyReport() {
    throw new Error('Not implemented: Weekly sales report');
  }
}
