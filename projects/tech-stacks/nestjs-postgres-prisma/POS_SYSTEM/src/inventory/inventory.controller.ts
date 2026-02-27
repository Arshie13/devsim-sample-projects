import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { updateInventorySchema, UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Put(':productId')
  @Roles(UserRole.ADMIN)
  async updateStock(
    @Param('productId') productId: string,
    @Body(new ZodValidationPipe(updateInventorySchema)) dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateStock(productId, dto);
  }

  @Get('low-stock')
  async getLowStock() {
    return this.inventoryService.getLowStockProducts();
  }

  @Get(':productId')
  async getByProductId(@Param('productId') productId: string) {
    return this.inventoryService.getInventoryByProductId(productId);
  }
}
