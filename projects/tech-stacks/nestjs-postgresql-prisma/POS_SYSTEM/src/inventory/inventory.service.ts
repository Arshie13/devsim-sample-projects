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

    // TODO: Add validation to prevent negative inventory (Level 2 challenge)
    // TODO: Implement concurrency-safe stock deduction with optimistic locking (Level 5 challenge)

    return this.prisma.inventory.update({
      where: { productId },
      data: { quantity: dto.quantity },
      include: { product: true },
    });
  }

  async getLowStock() {
    // BUG: This uses `lt` (less than) instead of `lte` (less than or equal)
    // When quantity equals lowStock threshold, it should still be flagged as low stock
    // This is intentionally buggy for Level 2, Task 2.1
    return this.prisma.inventory.findMany({
      where: {
        quantity: {
          lt: this.prisma.inventory.fields?.lowStock as any,
        },
      },
      include: { product: true },
    });
  }

  async getLowStockProducts() {
    // Workaround: fetch all and filter in-memory
    // BUG: Uses strict less-than instead of less-than-or-equal
    // This is intentionally buggy for Level 2, Task 2.1
    const allInventory = await this.prisma.inventory.findMany({
      include: { product: true },
    });

    return allInventory.filter((inv) => inv.quantity < inv.lowStock);
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
