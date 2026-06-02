import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (existingSku) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        sku: dto.sku,
        categoryId: dto.categoryId,
        inventory: {
          create: {
            quantity: dto.initialStock ?? 0,
            lowStock: 10,
          },
        },
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        inventory: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async deactivate(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
