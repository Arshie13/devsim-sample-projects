import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBudgetDto) {
    // Verify category exists and is an expense category
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.type !== 'EXPENSE') {
      throw new BadRequestException('Budgets can only be set for expense categories');
    }

    if (!category.isDefault && category.userId !== userId) {
      throw new ForbiddenException('Access denied to this category');
    }

    // Check for existing budget
    const existing = await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId: dto.categoryId,
        month: dto.month,
        year: dto.year,
      },
    });

    if (existing) {
      throw new ConflictException('Budget already exists for this category and period');
    }

    return this.prisma.budget.create({
      data: {
        amount: dto.amount,
        categoryId: dto.categoryId,
        month: dto.month,
        year: dto.year,
        userId,
      },
      include: {
        category: {
          select: { name: true, type: true, icon: true },
        },
      },
    });
  }

  async findAll(userId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        month: targetMonth,
        year: targetYear,
      },
      include: {
        category: {
          select: { name: true, type: true, icon: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate spent for each budget
    const enrichedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        // Get first and last day of the month
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

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
          budgetId: budget.id,
          category: budget.category.name,
          categoryIcon: budget.category.icon,
          budgetAmount: Number(budgetAmount.toFixed(2)),
          spent: Number(spent.toFixed(2)),
          remaining: Number(remaining.toFixed(2)),
          percentUsed: Number(percentUsed.toFixed(2)),
          exceeded: spent > budgetAmount,
          month: budget.month,
          year: budget.year,
        };
      }),
    );

    return enrichedBudgets;
  }

  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, type: true, icon: true },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return budget;
  }

  async update(id: string, userId: string, dto: UpdateBudgetDto) {
    await this.findOne(id, userId);

    return this.prisma.budget.update({
      where: { id },
      data: dto,
      include: {
        category: {
          select: { name: true, type: true, icon: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.budget.delete({
      where: { id },
    });

    return { message: 'Budget deleted successfully' };
  }
}
