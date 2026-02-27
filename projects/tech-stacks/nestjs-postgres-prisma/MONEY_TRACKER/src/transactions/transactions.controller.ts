import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTransactionDto, CreateTransactionDtoSchema } from './dto/create-transaction.dto';
import { UpdateTransactionDto, UpdateTransactionDtoSchema } from './dto/update-transaction.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { TransactionType } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateTransactionDtoSchema)) dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('accountId') accountId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: TransactionType,
  ) {
    return this.transactionsService.findAll(req.user.id, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      startDate,
      endDate,
      accountId,
      categoryId,
      type,
    });
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTransactionDtoSchema)) dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.transactionsService.remove(id, req.user.id);
  }
}
