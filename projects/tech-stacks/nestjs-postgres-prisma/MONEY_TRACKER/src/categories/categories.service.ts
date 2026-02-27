import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        type: dto.type,
        icon: dto.icon,
        userId,
        isDefault: false,
      },
    });
  }

  async findAll(userId: string) {
    // Return system defaults + user's custom categories (only active ones)
    return this.prisma.category.findMany({
      where: {
        OR: [{ isDefault: true }, { userId }],
        isActive: true,
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Allow access to system defaults or user's own categories
    if (!category.isDefault && category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return category;
  }

  async update(id: string, userId: string, dto: Partial<CreateCategoryDto>) {
    const category = await this.findOne(id, userId);

    // Prevent editing system defaults
    if (category.isDefault) {
      throw new ForbiddenException('Cannot edit default categories');
    }

    return this.prisma.category.update({
      where: { id: category.id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id, userId);

    // Prevent deleting system defaults
    if (category.isDefault) {
      throw new ForbiddenException('Cannot delete default categories');
    }

    return this.prisma.category.update({
      where: { id: category.id },
      data: { isActive: false },
    });
  }
}
