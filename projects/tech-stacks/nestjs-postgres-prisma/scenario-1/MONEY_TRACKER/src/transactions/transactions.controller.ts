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
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTransactionDto, CreateTransactionDtoSchema } from './dto/create-transaction.dto';
import { UpdateTransactionDto, UpdateTransactionDtoSchema } from './dto/update-transaction.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 1500.0 },
        type: { type: 'string', example: 'EXPENSE' },
        description: { type: 'string', example: 'Grocery shopping' },
        date: { type: 'string', format: 'date-time', example: '2026-08-28T00:00:00Z' },
        accountId: { type: 'string', format: 'uuid', example: 'uuid' },
        categoryId: { type: 'string', format: 'uuid', example: 'uuid' },
      },
      required: ['amount', 'type', 'date', 'accountId', 'categoryId'],
    },
  })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateTransactionDtoSchema)) dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  async findAll(@Request() req) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID (UUID)' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 2000.0 },
        type: { type: 'string', example: 'INCOME' },
        description: { type: 'string', example: 'Updated description' },
        date: { type: 'string', format: 'date-time', example: '2026-08-29T00:00:00Z' },
        accountId: { type: 'string', format: 'uuid', example: 'uuid' },
        categoryId: { type: 'string', format: 'uuid', example: 'uuid' },
      },
    },
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTransactionDtoSchema)) dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID (UUID)' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.transactionsService.remove(id, req.user.id);
  }
}
