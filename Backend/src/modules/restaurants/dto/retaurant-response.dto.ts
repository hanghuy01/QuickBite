import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 10.762622 })
  latitude: number;

  @ApiProperty({ example: 106.660172 })
  longitude: number;
}

export class RestaurantResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pizza Palace' })
  name: string;

  @ApiProperty({ example: 'Best pizza in town' })
  description: string;

  @ApiProperty({ example: '180/77 Nguyen Huu Canh' })
  address: string;

  @ApiProperty({ example: 'Italian' })
  category: string;

  @ApiProperty({ type: () => LocationDto })
  location: LocationDto;

  @ApiProperty({ example: 'https://example.com/pizza.jpg' })
  image: string;
}
