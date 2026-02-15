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
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCategoryDto, CreateCategoryDtoSchema } from './dto/create-category.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateCategoryDtoSchema)) dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.categoriesService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateCategoryDtoSchema.partial())) dto: Partial<CreateCategoryDto>,
  ) {
    return this.categoriesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.categoriesService.remove(id, req.user.id);
  }
}
