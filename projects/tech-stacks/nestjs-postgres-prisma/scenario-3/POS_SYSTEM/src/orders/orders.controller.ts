import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { createOrderSchema, CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string', format: 'uuid', example: 'product-uuid' },
              quantity: { type: 'number', example: 2 },
            },
            required: ['productId', 'quantity'],
          },
        },
        paymentMethod: { type: 'string', enum: ['CASH', 'CARD'], example: 'CASH' },
        discount: { type: 'number', example: 10 },
      },
      required: ['items', 'paymentMethod'],
    },
  })
  async create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('daily')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get daily sales orders (Admin only)' })
  async getDailySales() {
    return this.ordersService.getDailySales();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
