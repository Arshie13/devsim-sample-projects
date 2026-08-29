import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get application settings' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update application settings (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        storeName: { type: 'string', example: 'My Store' },
        storeAddress: { type: 'string', example: '123 Main St' },
        taxRate: { type: 'number', example: 0.07 },
        acceptCash: { type: 'boolean', example: true },
        acceptCard: { type: 'boolean', example: true },
      },
    },
  })
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
