import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        date: new Date(dto.date),
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
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        account: {
          select: { name: true, type: true },
        },
        category: {
          select: { name: true, type: true, icon: true },
        },
      },
    });
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
    await this.findOne(id, userId);

    return this.prisma.transaction.update({
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
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.transaction.delete({
      where: { id },
    });

    return { message: 'Transaction deleted successfully' };
  }
}
