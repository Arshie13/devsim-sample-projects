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
import { ProductsService } from './products.service';
import { createProductSchema, CreateProductDto } from './dto/create-product.dto';
import { updateProductSchema, UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deactivate(@Param('id') id: string) {
    return this.productsService.deactivate(id);
  }
}
