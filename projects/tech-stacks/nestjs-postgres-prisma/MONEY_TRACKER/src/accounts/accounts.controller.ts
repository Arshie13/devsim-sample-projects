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
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateAccountDto, CreateAccountDtoSchema } from './dto/create-account.dto';
import { UpdateAccountDto, UpdateAccountDtoSchema } from './dto/update-account.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateAccountDtoSchema)) dto: CreateAccountDto,
  ) {
    return this.accountsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAccountDtoSchema)) dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.accountsService.remove(id, req.user.id);
  }
}
