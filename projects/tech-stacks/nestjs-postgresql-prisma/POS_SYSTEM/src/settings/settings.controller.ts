import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @Roles(UserRole.ADMIN)
  async updateSettings(
    @Body()
    body: {
      storeName?: string;
      storeAddress?: string;
      taxRate?: number;
      acceptCash?: boolean;
      acceptCard?: boolean;
    },
  ) {
    return this.settingsService.updateSettings(body);
  }
}
