import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('receipts')
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  // TODO: Implement receipt endpoint
  @Get(':orderId')
  async getReceipt(@Param('orderId') orderId: string) {
    return this.receiptsService.generateReceipt(orderId);
  }
}
