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
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateBudgetDto, CreateBudgetDtoSchema } from './dto/create-budget.dto';
import { UpdateBudgetDto, UpdateBudgetDtoSchema } from './dto/update-budget.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateBudgetDtoSchema)) dto: CreateBudgetDto,
  ) {
    return this.budgetsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Request() req, @Query('month') month?: string, @Query('year') year?: string) {
    return this.budgetsService.findAll(
      req.user.id,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.budgetsService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateBudgetDtoSchema)) dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.budgetsService.remove(id, req.user.id);
  }
}
