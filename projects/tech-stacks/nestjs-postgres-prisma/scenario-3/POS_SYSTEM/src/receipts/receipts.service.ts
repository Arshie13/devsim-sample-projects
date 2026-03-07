import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReceiptsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement receipt generation
  // Should generate a printable receipt view for a given order
  async generateReceipt(orderId: string) {
    throw new Error('Not implemented: Receipt generation');
  }
}
