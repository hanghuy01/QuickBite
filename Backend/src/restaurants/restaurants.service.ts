import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>
  ) {}

  create(dto: CreateRestaurantDto) {
    const restaurant = this.restaurantRepo.create(dto);
    return this.restaurantRepo.save(restaurant);
  }

  findAll() {
    return this.restaurantRepo.find({ relations: ['menuItems'] });
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, dto);
    return this.restaurantRepo.save(restaurant);
  }

  async remove(id: number) {
    const restaurant = await this.findOne(id);
    return this.restaurantRepo.remove(restaurant);
  }
}
