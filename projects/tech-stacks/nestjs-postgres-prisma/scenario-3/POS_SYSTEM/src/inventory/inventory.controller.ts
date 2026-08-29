import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { updateInventorySchema, UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Put(':productId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update inventory stock for a product (Admin only)' })
  @ApiParam({ name: 'productId', type: String, description: 'Product ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', example: 100 },
      },
      required: ['quantity'],
    },
  })
  async updateStock(
    @Param('productId') productId: string,
    @Body(new ZodValidationPipe(updateInventorySchema)) dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateStock(productId, dto);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  async getLowStock() {
    return this.inventoryService.getLowStockProducts();
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory details for a specific product' })
  @ApiParam({ name: 'productId', type: String, description: 'Product ID (UUID)' })
  async getByProductId(@Param('productId') productId: string) {
    return this.inventoryService.getInventoryByProductId(productId);
  }
}
