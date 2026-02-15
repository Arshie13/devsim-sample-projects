import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async monthlySummary(userId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    // Get first and last day of the month
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const expenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const incomeTransactions = transactions.filter((t) => t.type === TransactionType.INCOME);
    const expenseTransactions = transactions.filter((t) => t.type === TransactionType.EXPENSE);

    return {
      month: targetMonth,
      year: targetYear,
      totalIncome: Number(income.toFixed(2)),
      totalExpenses: Number(expenses.toFixed(2)),
      netSavings: Number((income - expenses).toFixed(2)),
      transactionCount: transactions.length,
      averageIncome:
        incomeTransactions.length > 0 ? Number((income / incomeTransactions.length).toFixed(2)) : 0,
      averageExpense:
        expenseTransactions.length > 0
          ? Number((expenses / expenseTransactions.length).toFixed(2))
          : 0,
    };
  }

  async categoryBreakdown(
    userId: string,
    month?: number,
    year?: number,
    type: TransactionType = TransactionType.EXPENSE,
  ) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: { name: true, icon: true },
        },
      },
    });

    // Group by category
    const categoryMap = new Map<
      string,
      { name: string; icon: string | null; total: number; count: number }
    >();

    transactions.forEach((t) => {
      const categoryName = t.category.name;
      const existing = categoryMap.get(categoryName);
      if (existing) {
        existing.total += t.amount.toNumber();
        existing.count += 1;
      } else {
        categoryMap.set(categoryName, {
          name: categoryName,
          icon: t.category.icon,
          total: t.amount.toNumber(),
          count: 1,
        });
      }
    });

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const breakdown = Array.from(categoryMap.values()).map((cat) => ({
      categoryName: cat.name,
      categoryIcon: cat.icon,
      total: Number(cat.total.toFixed(2)),
      percentage: totalAmount > 0 ? Number(((cat.total / totalAmount) * 100).toFixed(2)) : 0,
      transactionCount: cat.count,
    }));

    // Sort by total descending
    breakdown.sort((a, b) => b.total - a.total);

    return {
      month: targetMonth,
      year: targetYear,
      type,
      breakdown,
    };
  }

  async trends(userId: string, months: number = 6) {
    const now = new Date();
    const trends = [];

    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const income = transactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount.toNumber(), 0);

      const expenses = transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount.toNumber(), 0);

      trends.push({
        month,
        year,
        totalIncome: Number(income.toFixed(2)),
        totalExpense: Number(expenses.toFixed(2)),
        netSavings: Number((income - expenses).toFixed(2)),
      });
    }

    return trends;
  }

  async budgetAlerts(userId: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        month: currentMonth,
        year: currentYear,
      },
      include: {
        category: {
          select: { name: true, icon: true },
        },
      },
    });

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const alerts = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: TransactionType.EXPENSE,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount.toNumber(), 0);
        const budgetAmount = budget.amount.toNumber();
        const remaining = budgetAmount - spent;
        const percentUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

        return {
          categoryName: budget.category.name,
          categoryIcon: budget.category.icon,
          budgetAmount: Number(budgetAmount.toFixed(2)),
          spent: Number(spent.toFixed(2)),
          remaining: Number(remaining.toFixed(2)),
          percentUsed: Number(percentUsed.toFixed(2)),
          exceeded: spent > budgetAmount,
        };
      }),
    );

    // Filter to only show budgets >= 80% or exceeded
    const criticalAlerts = alerts.filter((alert) => alert.percentUsed >= 80 || alert.exceeded);

    // Sort by percentUsed descending
    criticalAlerts.sort((a, b) => b.percentUsed - a.percentUsed);

    return criticalAlerts;
  }
}
