import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.setting.findFirst();

    if (!settings) {
      // Create default settings if none exist
      return this.prisma.setting.create({
        data: {
          storeName: 'My POS Store',
          storeAddress: '',
          taxRate: 0,
          acceptCash: true,
          acceptCard: true,
        },
      });
    }

    return settings;
  }

  async updateSettings(data: {
    storeName?: string;
    storeAddress?: string;
    taxRate?: number;
    acceptCash?: boolean;
    acceptCard?: boolean;
  }) {
    const settings = await this.prisma.setting.findFirst();

    if (!settings) {
      return this.prisma.setting.create({ data: data as any });
    }

    return this.prisma.setting.update({
      where: { id: settings.id },
      data,
    });
  }
}
