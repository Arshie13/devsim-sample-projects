import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateAccountDto, CreateAccountDtoSchema } from './dto/create-account.dto';
import { UpdateAccountDto, UpdateAccountDtoSchema } from './dto/update-account.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Savings Account' },
        type: { type: 'string', example: 'ASSET' },
        balance: { type: 'number', example: 1000.0 },
        currency: { type: 'string', example: 'USD' },
        allowNegativeBalance: { type: 'boolean', example: false },
      },
      required: ['name', 'type'],
    },
  })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateAccountDtoSchema)) dto: CreateAccountDto,
  ) {
    return this.accountsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the authenticated user' })
  async findAll(@Request() req) {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific account by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Account ID (UUID)' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Account ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Account Name' },
        type: { type: 'string', example: 'LIABILITY' },
        allowNegativeBalance: { type: 'boolean', example: true },
      },
    },
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAccountDtoSchema)) dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Account ID (UUID)' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.accountsService.remove(id, req.user.id);
  }
}
