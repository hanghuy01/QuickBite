import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  FindAllRestaurantsDto,
  GetRestaurantDistanceDto,
} from './dto/findAll-retaurant.dto';
import Redis from 'ioredis';

interface OSRMRoute {
  distance: number;
  duration: number;
}

interface OSRMResponse {
  code: string;
  routes: OSRMRoute[];
}

export type DistanceResult = {
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
    lonRestaurant: number,
    speedKmh: number = 30 // mặc định xe máy 30 km/h
  ) {
    const EXTRA_BUFFER_MINUTES = 15; // thêm 15 phút cho thời gian di chuyển
    const ROUNDING_DECIMAL = 10; // để làm tròn 1 chữ số thập phân
    const SECONDS_IN_MINUTE = 60;
    const EARTH_RADIUS = 6371; // km
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const dLat = toRadians(latRestaurant - latUser);
    const dLon = toRadians(lonRestaurant - lonUser);
    const haversine =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(latUser)) *
        Math.cos(toRadians(latRestaurant)) *
        Math.sin(dLon / 2) ** 2;

    const angularDistance =
      2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    const distanceKm =
      Math.round(EARTH_RADIUS * angularDistance * ROUNDING_DECIMAL) /
      ROUNDING_DECIMAL;

    const timeMinutes =
      Math.ceil((distanceKm / speedKmh) * SECONDS_IN_MINUTE) +
      EXTRA_BUFFER_MINUTES;
    return { distanceKm, durationMin: timeMinutes };
  }

  async getRouteInfo(
    latUser: number,
    lonUser: number,
    latRestaurant: number,
    lonRestaurant: number
  ) {
    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${lonRestaurant},${latRestaurant};${lonUser},${latUser}`;

      const METERS_IN_KM = 1000;
      const ROUNDING_DECIMAL = 10; // để làm tròn 1 chữ số thập phân
      const SECONDS_IN_MINUTE = 60;
      const EXTRA_BUFFER_MINUTES = 22; // thêm 22 phút cho thời gian di chuyển
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
        distanceKm:
          Math.round((route.distance / METERS_IN_KM) * ROUNDING_DECIMAL) /
          ROUNDING_DECIMAL,
        durationMin:
          Math.ceil(route.duration / SECONDS_IN_MINUTE) + EXTRA_BUFFER_MINUTES,
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

    const qb = this.restaurantRepo.createQueryBuilder('restaurant');

    if (q) {
      qb.where('restaurant.name ILIKE :q', { q: `%${q}%` });
    }

    if (category) {
      qb.andWhere('restaurant.category = :category', { category });
    }
    return qb.getMany();
  }

  async getRestaurantDistance(dto: GetRestaurantDistanceDto) {
    const { id, lat, lon } = dto;
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new BadRequestException('Restaurant not found');

    const DISTANCE_CACHE_TTL = 300; // 5 minutes
    const roundedLat = Number(lat).toFixed(3);
    const roundedLon = Number(lon).toFixed(3);
    // Tạo cache key duy nhất cho (user → restaurant)
    const cacheKey = `distance:${id}:${roundedLat}:${roundedLon}`;

    // Kiểm tra cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as DistanceResult;
    }

    //  Nếu chưa có cache → gọi OSRM
    // const distance = await this.getRouteInfo(
    //   lat,
    //   lon,
    //   restaurant.location.latitude,
    //   restaurant.location.longitude
    // );

    // đường chim bay
    const distance = this.getDistanceKm(
      lat,
      lon,
      restaurant.location.latitude,
      restaurant.location.longitude
    );

    const result = { restaurantId: id, distance };

    // Lưu vào Redis TTL = 5 phút

    await this.redis.set(
      cacheKey,
      JSON.stringify(result),
      'EX',
      DISTANCE_CACHE_TTL
    );

    return result;
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: {
        menuItems: true,
      },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto) {
    return await this.restaurantRepo.update(id, dto);
  }

  async remove(id: number) {
    const result = await this.restaurantRepo.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Restaurant not found');
    }
  }
}
