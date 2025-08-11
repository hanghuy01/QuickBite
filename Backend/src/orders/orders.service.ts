import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '@/auth/entities/user.entity';
import { Restaurant } from '@/restaurants/entities/restaurant.entity'; //src/auth/entities/user.entity.ts và src/users/entities/user.entity.ts

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantsRepo: Repository<Restaurant>
  ) {}

  async create(dto: CreateOrderDto) {
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
      items: dto.items,
      status: 'pending',
    });

    return this.ordersRepo.save(order);
  }

  async findAll() {
    return this.ordersRepo.find();
  }

  async findOne(id: number) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.ordersRepo.save(order);
  }
}
