import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { RestaurantResponseDto } from './dto/retaurant-response.dto';
import { SearchService } from '../elasticsearch/search.service';

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
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private searchService: SearchService
  ) {}

  // Khoảng cách theo đường chim bay
  private getDistanceKm(
    latUser: number,
    lonUser: number,
    latRestaurant: number,
    lonRestaurant: number
  ) {
    const EXTRA_BUFFER_MINUTES = 15; // thêm 15 phút cho thời gian di chuyển
    const ROUNDING_DECIMAL = 10; // để làm tròn 1 chữ số thập phân
    const SECONDS_IN_MINUTE = 60;
    const speedKmh = 30; // mặc định xe máy 30 km/h
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

  async create(dto: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    const { lat, lon, ...rest } = dto;
    const restaurant = this.restaurantRepo.create({
      ...rest,
      location: lat && lon ? { latitude: lat, longitude: lon } : null,
    });
    try {
      return await this.restaurantRepo.save(restaurant);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException(
        'Unexpected error while creating restaurant'
      );
    }
  }

  async findAll(
    query: FindAllRestaurantsDto
  ): Promise<RestaurantResponseDto[]> {
    const { q, category, limit = 20, offset = 0 } = query;

    // if (q) {
    //   // search theo ILIKE
    //   // qb.where('restaurant.name ILIKE :q', { q: `%${q}%` });

    //   qb.where(`similarity(restaurant.name, :q) > 0.3`, { q });
    //   qb.orderBy(`similarity(restaurant.name, :q)`, 'DESC');
    // }

    // Nếu có query q → gọi Elasticsearch
    return this.searchService.searchRestaurants(q, category, limit, offset);
  }

  async getRestaurantDistance(
    dto: GetRestaurantDistanceDto
  ): Promise<DistanceResult> {
    const { id, lat, lon } = dto;

    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException(`Restaurant ${id} not found`);

    const latitude = parseFloat(lat.toString());
    const longitude = parseFloat(lon.toString());

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('Invalid latitude/longitude');
    }

    const DISTANCE_CACHE_TTL = 300; // 5 minutes
    const roundedLat = latitude.toFixed(3);
    const roundedLon = longitude.toFixed(3);
    // Tạo cache key duy nhất cho (user → restaurant)
    const cacheKey = `distance:${id}:${roundedLat}:${roundedLon}`;

    // Kiểm tra cache
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as DistanceResult;
      }
    } catch (e) {
      console.warn(
        `Redis unavailable, skipping cache: ${e instanceof Error ? e.message : e}`
      );
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

    const result: DistanceResult = { restaurantId: id, distance };

    // Lưu vào Redis TTL = 5 phút

    try {
      await this.redis.set(
        cacheKey,
        JSON.stringify(result),
        'EX',
        DISTANCE_CACHE_TTL
      );
    } catch (e) {
      console.warn(`Redis set failed: ${e instanceof Error ? e.message : e}`);
    }

    return result;
  }

  async findOne(id: number): Promise<RestaurantResponseDto> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: {
        menuItems: true,
      },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    try {
      return await this.restaurantRepo.update(id, dto);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.restaurantRepo.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
  }
}
