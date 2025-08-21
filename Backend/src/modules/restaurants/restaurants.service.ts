import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FindAllRestaurantsDto } from './dto/findAll-retaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>
  ) {}

  private getDistanceKm(
    latUser: number,
    lonUser: number,
    latRestaurant: number,
    lonRestaurant: number
  ) {
    const R = 6371; // km
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(latRestaurant - latUser);
    const dLon = toRad(lonRestaurant - lonUser);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(latUser)) *
        Math.cos(toRad(latRestaurant)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  create(dto: CreateRestaurantDto) {
    const restaurant = this.restaurantRepo.create({
      ...dto,
      location: {
        latitude: dto.lat,
        longitude: dto.lon,
      },
    });
    return this.restaurantRepo.save(restaurant);
  }

  async findAll(query: FindAllRestaurantsDto) {
    const { q, category, lat, lon } = query;

    const where: FindOptionsWhere<Restaurant> = {};
    if (q) {
      where.name = ILike(`%${q}%`);
    }
    if (category) {
      where.category = category;
    }
    const restaurants = await this.restaurantRepo.find({
      where,
      relations: ['menuItems'],
    });

    if (lat && lon) {
      return restaurants
        .map((r) => {
          const distance = this.getDistanceKm(
            lat,
            lon,
            r.location.latitude,
            r.location.longitude
          );
          return { ...r, distance };
        })
        .sort((a, b) => a.distance - b.distance);
    }
    return restaurants;
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
