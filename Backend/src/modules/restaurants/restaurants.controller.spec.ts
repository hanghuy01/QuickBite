import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { DistanceResult, RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantResponseDto } from './dto/retaurant-response.dto';
import { FindAllRestaurantsDto } from './dto/findAll-retaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UpdateResult } from 'typeorm';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: jest.Mocked<RestaurantsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            getRestaurantDistance: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const dto: CreateRestaurantDto = {
        name: 'Test Restaurant',
        category: 'Pizza',
        description: 'Best pizza',
        lat: 10.1,
        lon: 106.1,
        address: '123 Test St',
        image: 'test.jpg',
      };
      const result: RestaurantResponseDto = {
        id: 1,
        name: dto.name,
        category: dto.category,
        description: dto.description,
        address: dto.address,
        image: dto.image,
        location: { latitude: dto.lat, longitude: dto.lon },
      };
      // Dùng cho unit test mock
      service.create.mockResolvedValue(result);
      // Dùng cho integration test
      //   jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return array of restaurants', async () => {
      const query: FindAllRestaurantsDto = { limit: 10, offset: 0 };
      const result: RestaurantResponseDto[] = [
        {
          id: 1,
          name: 'Pizza Palace',
          category: 'Pizza',
          description: 'Best pizza',
          address: 'Test',
          image: 'img.jpg',
          location: { latitude: 10, longitude: 106 },
        },
      ];

      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll(query)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return one restaurant by id', async () => {
      const result: RestaurantResponseDto = {
        id: 2,
        name: 'Burger House',
        category: 'Burger',
        description: 'Best burgers',
        address: 'Test',
        image: 'burger.jpg',
        location: { latitude: 11, longitude: 107 },
      };

      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getDistance', () => {
    it('should return distance to a restaurant', async () => {
      const result: DistanceResult = {
        restaurantId: 1,
        distance: { distanceKm: 5, durationMin: 15 },
      };

      service.getRestaurantDistance.mockResolvedValue(result);

      expect(await controller.getDistance(1, 10.1, 106.2)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getRestaurantDistance).toHaveBeenCalledWith({
        id: 1,
        lat: 10.1,
        lon: 106.2,
      });
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      const dto: UpdateRestaurantDto = { name: 'Updated Name' };
      const result: UpdateResult = { affected: 1, generatedMaps: [], raw: [] };

      service.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a restaurant', async () => {
      service.remove.mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
