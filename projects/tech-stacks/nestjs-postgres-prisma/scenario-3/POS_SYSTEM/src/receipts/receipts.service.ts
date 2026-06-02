import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReceiptsService {
  constructor(private prisma: PrismaService) {}

  async generateReceipt(orderId: string) {
    return {};
  }
}
