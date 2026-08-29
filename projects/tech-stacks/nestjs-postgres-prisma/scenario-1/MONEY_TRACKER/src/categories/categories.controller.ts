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
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCategoryDto, CreateCategoryDtoSchema } from './dto/create-category.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Groceries' },
        type: { type: 'string', example: 'EXPENSE' },
        icon: { type: 'string', example: '🛒' },
      },
      required: ['name', 'type'],
    },
  })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateCategoryDtoSchema)) dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the authenticated user' })
  async findAll(@Request() req) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID (UUID)' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.categoriesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Category Name' },
        type: { type: 'string', example: 'INCOME' },
        icon: { type: 'string', example: '💰' },
      },
    },
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateCategoryDtoSchema.partial())) dto: Partial<CreateCategoryDto>,
  ) {
    return this.categoriesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID (UUID)' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.categoriesService.remove(id, req.user.id);
  }
}
