import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepo = <T = any>(): MockRepo<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
});

type MockQueryBuilder = {
  where: jest.MockedFunction<any>;
  andWhere: jest.MockedFunction<any>;
  take: jest.MockedFunction<any>;
  skip: jest.MockedFunction<any>;
  getMany: jest.MockedFunction<any>;
};

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let repo: MockRepo<Restaurant>;
  let redis: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: getRepositoryToken(Restaurant), useValue: createMockRepo() },
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    repo = module.get(getRepositoryToken(Restaurant));
    redis = module.get('REDIS_CLIENT');
  });

  describe('create', () => {
    it('should create and save a restaurant', async () => {
      const dto: CreateRestaurantDto = {
        name: 'Test',
        category: 'Pizza',
        description: 'Nice',
        lat: 10,
        lon: 20,
        address: '123 street',
        image: 'img.jpg',
      };
      const entity = { id: 1, ...dto } as Restaurant;

      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith({
        name: dto.name,
        category: dto.category,
        description: dto.description,
        address: dto.address,
        image: dto.image,
        location: { latitude: dto.lat, longitude: dto.lon },
      });
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      const dto = { name: 'err' } as CreateRestaurantDto;
      repo.create.mockReturnValue(dto);
      repo.save.mockRejectedValue(new Error('DB error'));

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should return restaurants with query', async () => {
      const qb: MockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      };
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({
        q: 'Pizza',
        category: 'Fastfood',
      });
      expect(result).toEqual([{ id: 1 }]);
      expect(qb.where).toHaveBeenCalled();
      expect(qb.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a restaurant', async () => {
      const restaurant = { id: 1 } as Restaurant;
      repo.findOne.mockResolvedValue(restaurant);

      const result = await service.findOne(1);
      expect(result).toBe(restaurant);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRestaurantDistance', () => {
    it('should return cached distance if exists', async () => {
      const dto = { id: 1, lat: 10, lon: 20 };
      const cached = {
        restaurantId: 1,
        distance: { distanceKm: 1, durationMin: 2 },
      };
      repo.findOne.mockResolvedValue({
        id: 1,
        location: { latitude: 10, longitude: 20 },
      });
      redis.get.mockResolvedValue(JSON.stringify(cached));

      const result = await service.getRestaurantDistance(dto);
      expect(result).toEqual(cached);
    });

    it('should calculate distance if no cache', async () => {
      const dto = { id: 1, lat: 10, lon: 20 };
      repo.findOne.mockResolvedValue({
        id: 1,
        location: { latitude: 11, longitude: 21 },
      });
      redis.get.mockResolvedValue(null);
      redis.set.mockResolvedValue('OK');

      const result = await service.getRestaurantDistance(dto);
      expect(result.restaurantId).toBe(1);
      expect(result.distance.distanceKm).toBeGreaterThan(0);
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(
        service.getRestaurantDistance({ id: 1, lat: 10, lon: 20 })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });
      repo.update.mockResolvedValue({ affected: 1 });

      await service.update(1, { name: 'New' } as UpdateRestaurantDto);
      expect(repo.update).toHaveBeenCalledWith(1, { name: 'New' });
    });

    it('should throw if restaurant not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(
        service.update(1, {} as UpdateRestaurantDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove restaurant', async () => {
      repo.softDelete.mockResolvedValue({ affected: 1 });
      await service.remove(1);
      expect(repo.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw if restaurant not found', async () => {
      repo.softDelete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
