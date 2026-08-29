import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { createOrderSchema, CreateOrderDto } from './dto/create-order.dto';
import { updateOrderStatusSchema, UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
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
              productId: { type: 'string', example: 'product-uuid' },
              quantity: { type: 'number', example: 2 },
              price: { type: 'number', example: 19.99 },
            },
            required: ['productId', 'quantity'],
          },
        },
        shippingAddress: { type: 'string', example: '123 Main St, City, Country' },
        paymentMethod: { type: 'string', enum: ['CARD', 'CASH'], example: 'CARD' },
      },
      required: ['items', 'shippingAddress', 'paymentMethod'],
    },
  })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(createOrderSchema)) dto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get orders for the authenticated user' })
  async findMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an order status by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
          example: 'SHIPPED',
        },
      },
      required: ['status'],
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema)) dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
