import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { createProductSchema, CreateProductDto } from './dto/create-product.dto';
import { updateProductSchema, UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createProductSchema))
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Coffee Beans' },
        description: { type: 'string', example: 'Premium arabica coffee beans' },
        price: { type: 'number', example: 12.99 },
        sku: { type: 'string', example: 'COFFEE-001' },
        categoryId: { type: 'string', format: 'uuid', example: 'category-uuid' },
        initialStock: { type: 'number', example: 100 },
      },
      required: ['name', 'price', 'sku', 'categoryId'],
    },
  })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (optionally filtered by search)' })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a product by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Premium Coffee Beans' },
        description: { type: 'string', example: 'High-quality arabica beans' },
        price: { type: 'number', example: 14.99 },
        categoryId: { type: 'string', format: 'uuid', example: 'new-category-uuid' },
        isActive: { type: 'boolean', example: true },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate a product by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  async deactivate(@Param('id') id: string) {
    return this.productsService.deactivate(id);
  }
}
