import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@/auth/entities/user.entity';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { OrderStatus } from '@/common/enums';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantsRepo: Repository<Restaurant>
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const user = await this.usersRepo.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const restaurant = await this.restaurantsRepo.findOne({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const order = this.ordersRepo.create({
      user,
      restaurant,
      totalAmount: dto.totalAmount,
      items: dto.items,
      status: OrderStatus.PENDING,
    });

    return this.ordersRepo.save(order);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    return this.ordersRepo.find();
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findMyOrder(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepo.find({
      where: { user: { id: userId } },
    });
    if (!orders) throw new NotFoundException('Orders not found');
    return orders;
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<OrderResponseDto> {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return this.ordersRepo.save(order);
  }
}
