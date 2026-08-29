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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateBudgetDto, CreateBudgetDtoSchema } from './dto/create-budget.dto';
import { UpdateBudgetDto, UpdateBudgetDtoSchema } from './dto/update-budget.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('budgets')
@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 5000.0 },
        month: { type: 'number', example: 8, minimum: 1, maximum: 12 },
        year: { type: 'number', example: 2026, minimum: 2000, maximum: 2100 },
        categoryId: { type: 'string', format: 'uuid', example: 'cuid_or_uuid' },
      },
      required: ['amount', 'month', 'year', 'categoryId'],
    },
  })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateBudgetDtoSchema)) dto: CreateBudgetDto,
  ) {
    return this.budgetsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets (optionally filtered by month/year)' })
  @ApiQuery({ name: 'month', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: String })
  async findAll(@Request() req, @Query('month') month?: string, @Query('year') year?: string) {
    return this.budgetsService.findAll(
      req.user.id,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific budget by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Budget ID (UUID)' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.budgetsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a budget by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Budget ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 6000.0 },
        month: { type: 'number', example: 9 },
        year: { type: 'number', example: 2026 },
      },
    },
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateBudgetDtoSchema)) dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Budget ID (UUID)' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.budgetsService.remove(id, req.user.id);
  }
}
