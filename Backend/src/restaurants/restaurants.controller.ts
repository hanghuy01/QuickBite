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
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiBody({
    type: CreateRestaurantDto,
    description: 'Restaurant create',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Restaurant created',
    schema: {
      example: {
        id: 'c9f5d8b2-1a2b-4c3d-9e0f-123456789abc',
        name: 'Pizza Palace',
        description: 'Best pizza in town',
        address: '180/77 Nguyen Huu Canh',
        imageUrl: 'https://example.com/pizza.jpg',
        menu: [],
      },
    },
  })
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
          description: 'Best pizza in town',
          address: '180/77 Nguyen Huu Canh',
          imageUrl: 'https://example.com/pizza.jpg',
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
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant found',
    schema: {
      example: {
        id: 'c9f5d8b2-1a2b-4c3d-9e0f-123456789abc',
        name: 'Pizza Palace',
        description: 'Best pizza in town',
        address: '180/77 Nguyen Huu Canh',
        imageUrl: 'https://example.com/pizza.jpg',
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
  @ApiOperation({ summary: 'Update a restaurant' })
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
        imageUrl: 'https://example.com/pizza-new.jpg',
        menu: [],
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a restaurant' })
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
