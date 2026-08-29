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
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createProductSchema))
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Laptop' },
        description: { type: 'string', example: 'High-performance laptop' },
        price: { type: 'number', example: 999.99 },
        image: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
        sku: { type: 'string', example: 'SKU123' },
        weight: { type: 'string', example: '2.5kg' },
        stock: { type: 'number', example: 50 },
        categoryId: { type: 'string', example: 'category-uuid' },
      },
      required: ['name', 'price', 'image', 'sku', 'categoryId'],
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  @ApiOperation({ summary: 'Update a product by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Laptop' },
        description: { type: 'string', example: 'Updated description' },
        price: { type: 'number', example: 1099.99 },
        image: { type: 'string', format: 'uri', example: 'https://example.com/new-image.jpg' },
        sku: { type: 'string', example: 'SKU456' },
        weight: { type: 'string', example: '3.0kg' },
        stock: { type: 'number', example: 75 },
        categoryId: { type: 'string', example: 'new-category-uuid' },
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate a product by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  async deactivate(@Param('id') id: string) {
    return this.productsService.deactivate(id);
  }
}
