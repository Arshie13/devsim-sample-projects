import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        name: dto.name,
        type: dto.type,
        balance: dto.balance,
        currency: dto.currency,
        allowNegativeBalance: dto.allowNegativeBalance,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return account;
  }

  async update(id: string, userId: string, dto: UpdateAccountDto) {
    const account = await this.findOne(id, userId);

    return this.prisma.account.update({
      where: { id: account.id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const account = await this.findOne(id, userId);

    return this.prisma.account.update({
      where: { id: account.id },
      data: { isActive: false },
    });
  }
}
