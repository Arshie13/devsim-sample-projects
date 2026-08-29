import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('receipts')
@Controller('receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Generate a receipt for a specific order' })
  @ApiParam({ name: 'orderId', type: String, description: 'Order ID (UUID)' })
  async getReceipt(@Param('orderId') orderId: string) {
    return this.receiptsService.generateReceipt(orderId);
  }
}
