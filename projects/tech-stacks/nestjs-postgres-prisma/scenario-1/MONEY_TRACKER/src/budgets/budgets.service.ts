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

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBudgetDto) {
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

    return this.prisma.budget.findMany({
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
