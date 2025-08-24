import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FindAllRestaurantsDto } from './dto/findAll-retaurant.dto';
import Redis from 'ioredis';

interface OSRMRoute {
  distance: number;
  duration: number;
}

interface OSRMResponse {
  code: string;
  routes: OSRMRoute[];
}

type DistanceResult = {
  restaurantId: number;
  distance: {
    distanceKm: number;
    durationMin: number;
  };
};

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  // Khoảng cách theo đường chim bay
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

  async getRouteInfo(
    latUser: number,
    lonUser: number,
    latRestaurant: number,
    lonRestaurant: number
  ) {
    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${lonRestaurant},${latRestaurant};${lonUser},${latUser}`;

      const response = await fetch(url);
      const data = (await response.json()) as OSRMResponse;

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.warn('OSRM không tìm thấy đường đi hợp lệ', {
          latUser,
          lonUser,
          latRestaurant,
          lonRestaurant,
        });
        return { distanceKm: Infinity, durationMin: Infinity };
      }

      const route = data.routes[0];
      return {
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMin: Math.ceil(route.duration / 60) + 22, //thêm 22 phút cho thời gian di chuyển
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đường đi:', error);
      return { distanceKm: Infinity, durationMin: Infinity };
    }
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
    const { q, category } = query;

    const where: FindOptionsWhere<Restaurant> = {};
    if (q) {
      where.name = ILike(`%${q}%`);
    }
    if (category) {
      where.category = category;
    }
    return this.restaurantRepo.find({ where });
  }

  async getRestaurantDistance(id: number, lat: number, lon: number) {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // Tạo cache key duy nhất cho (user → restaurant)
    const cacheKey = `distance:${id}:${lat}:${lon}`;

    // Kiểm tra cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as DistanceResult;
    }

    //  Nếu chưa có cache → gọi OSRM
    const distance = await this.getRouteInfo(
      lat,
      lon,
      restaurant.location.latitude,
      restaurant.location.longitude
    );

    const result = { restaurantId: id, distance };

    // Lưu vào Redis TTL = 5 phút
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300);

    return result;
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
