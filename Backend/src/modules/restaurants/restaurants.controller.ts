import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  RestaurantResponseDto,
} from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FindAllRestaurantsDto } from './dto/findAll-retaurant.dto';
import { Roles } from '@/auth/passport/roles.decorator';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(['ADMIN'])
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new restaurant (Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: RestaurantResponseDto })
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of restaurants' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of restaurants',
    schema: {
      example: [
        {
          id: 'c9f5d8b2-1a2b-4c3d-9e0f-123456789abc',
          name: 'Pizza Palace',
          category: 'Pizza',
          description: 'Best pizza in town',
          location: {
            latitude: 10.7769,
            longitude: 106.6959,
          },
          address: '180/77 Nguyen Huu Canh',
          image: 'https://example.com/pizza.jpg',
          menu: [
            {
              id: 'a1b2c3d4-1111-2222-3333-444455556666',
              name: 'Margherita',
              price: 8.99,
              description: 'Classic margherita pizza',
              imageUrl: 'https://example.com/margherita.jpg',
            },
          ],
        },
      ],
    },
  })
  findAll(@Query() query: FindAllRestaurantsDto) {
    return this.restaurantsService.findAll(query);
  }

  @Get(':id/distance')
  getDistance(
    @Param('id') id: number,
    @Query('lat') lat: number,
    @Query('lon') lon: number
  ) {
    return this.restaurantsService.getRestaurantDistance(id, lat, lon);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant found',
    schema: {
      example: {
        id: 'c9f5d8b2-1a2b-4c3d-9e0f-123456789abc',
        category: 'Pizza',
        name: 'Pizza Palace',
        location: {
          latitude: 10.7769,
          longitude: 106.6959,
        },
        description: 'Best pizza in town',
        address: '180/77 Nguyen Huu Canh',
        image: 'https://example.com/pizza.jpg',
        menu: [
          {
            id: 'a1b2c3d4-1111-2222-3333-444455556666',
            name: 'Margherita',
            price: 8.99,
            description: 'Classic margherita pizza',
            imageUrl: 'https://example.com/margherita.jpg',
          },
        ],
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a restaurant (Admin only)' })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant updated',
    schema: {
      example: {
        id: 'c9f5d8b2-1a2b-4c3d-9e0f-123456789abc',
        name: 'Pizza Palace (Updated)',
        description: 'New description',
        address: '180/77 Nguyen Huu Canh',
        image: 'https://example.com/pizza-new.jpg',
        menu: [],
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a restaurant (Admin only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Restaurant deleted (no content)',
    schema: { example: null },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Restaurant not found',
        error: 'Not Found',
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
