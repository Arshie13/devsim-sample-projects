import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async updateStock(productId: string, dto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory record not found for this product');
    }

    return this.prisma.inventory.update({
      where: { productId },
      data: { quantity: dto.quantity },
      include: { product: true },
    });
  }

  async getLowStock() {
    return [];
  }

  async getLowStockProducts() {
    return [];
  }

  async getInventoryByProductId(productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: { product: true },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    return inventory;
  }
}
