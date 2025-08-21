import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from '@/auth/passport/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders ' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('my/:id')
  @ApiOperation({ summary: 'Get orders of a specific user' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findMyOrder(@Param('id') id: string) {
    return this.ordersService.findMyOrder(+id);
  }

  @Patch(':id/status')
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
