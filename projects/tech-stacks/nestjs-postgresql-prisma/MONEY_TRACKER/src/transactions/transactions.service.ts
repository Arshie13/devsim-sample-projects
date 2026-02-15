import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType, Prisma } from '@prisma/client';

interface FindAllFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
}

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
    });

    if (!account || account.userId !== userId) {
      throw new ForbiddenException('Invalid account');
    }

    // Verify category exists and is accessible
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category || !category.isActive) {
      throw new BadRequestException('Invalid or inactive category');
    }

    if (!category.isDefault && category.userId !== userId) {
      throw new ForbiddenException('Access denied to this category');
    }

    // Check balance for expenses
    if (dto.type === TransactionType.EXPENSE && !account.allowNegativeBalance) {
      if (account.balance.toNumber() < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }
    }

    // Validate date
    const transactionDate = new Date(dto.date);
    if (transactionDate > new Date()) {
      throw new BadRequestException('Transaction date cannot be in the future');
    }

    // Create transaction and update balance atomically
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          type: dto.type,
          amount: dto.amount,
          description: dto.description,
          note: dto.note,
          accountId: dto.accountId,
          categoryId: dto.categoryId,
          date: transactionDate,
          userId,
        },
        include: {
          account: {
            select: { name: true, type: true },
          },
          category: {
            select: { name: true, type: true, icon: true },
          },
        },
      });

      // Update account balance
      const balanceChange = dto.type === TransactionType.INCOME ? dto.amount : -dto.amount;
      await tx.account.update({
        where: { id: dto.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return transaction;
    });
  }

  async findAll(userId: string, filters: FindAllFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    if (filters.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          date: 'desc',
        },
        include: {
          account: {
            select: { name: true, type: true },
          },
          category: {
            select: { name: true, type: true, icon: true },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        account: {
          select: { name: true, type: true },
        },
        category: {
          select: { name: true, type: true, icon: true },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return transaction;
  }

  async update(id: string, userId: string, dto: UpdateTransactionDto) {
    const existingTransaction = await this.findOne(id, userId);

    // If accountId is being changed, verify the new account
    if (dto.accountId && dto.accountId !== existingTransaction.accountId) {
      const account = await this.prisma.account.findUnique({
        where: { id: dto.accountId },
      });

      if (!account || account.userId !== userId) {
        throw new ForbiddenException('Invalid account');
      }
    }

    // If categoryId is being changed verify the new category
    if (dto.categoryId && dto.categoryId !== existingTransaction.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category || !category.isActive) {
        throw new BadRequestException('Invalid or inactive category');
      }
    }

    // Validate date if provided
    if (dto.date) {
      const transactionDate = new Date(dto.date);
      if (transactionDate > new Date()) {
        throw new BadRequestException('Transaction date cannot be in the future');
      }
    }

    // Update transaction and adjust balances atomically
    return this.prisma.$transaction(async (tx) => {
      // Reverse the old transaction effect
      const oldBalanceChange =
        existingTransaction.type === TransactionType.INCOME
          ? -existingTransaction.amount.toNumber()
          : existingTransaction.amount.toNumber();

      await tx.account.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: oldBalanceChange,
          },
        },
      });

      // Update the transaction
      const updated = await tx.transaction.update({
        where: { id },
        data: {
          ...dto,
          date: dto.date ? new Date(dto.date) : undefined,
        },
        include: {
          account: {
            select: { name: true, type: true },
          },
          category: {
            select: { name: true, type: true, icon: true },
          },
        },
      });

      // Apply the new transaction effect
      const newAmount = dto.amount || existingTransaction.amount.toNumber();
      const newType = dto.type || existingTransaction.type;
      const newAccountId = dto.accountId || existingTransaction.accountId;

      const newBalanceChange = newType === TransactionType.INCOME ? newAmount : -newAmount;

      await tx.account.update({
        where: { id: newAccountId },
        data: {
          balance: {
            increment: newBalanceChange,
          },
        },
      });

      return updated;
    });
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    // Delete transaction and reverse balance atomically
    return this.prisma.$transaction(async (tx) => {
      await tx.transaction.delete({
        where: { id },
      });

      // Reverse the balance change
      const balanceChange =
        transaction.type === TransactionType.INCOME
          ? -transaction.amount.toNumber()
          : transaction.amount.toNumber();

      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return { message: 'Transaction deleted successfully' };
    });
  }
}
