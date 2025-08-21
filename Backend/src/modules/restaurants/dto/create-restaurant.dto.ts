import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Palace',
    description: 'The name of the restaurant',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Italian',
    description: 'Category of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Best pizza in town',
    description: 'Short description of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Restaurant address',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'https://example.com/pizza.jpg',
    description: 'Image URL of the restaurant',
    required: false,
  })
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: 12.34,
    description: 'Latitude of the restaurant location',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @ApiProperty({
    example: 56.78,
    description: 'Longitude of the restaurant location',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lon?: number;
}

export class RestaurantResponseDto {
  @ApiProperty({ example: 'c9f5d8b2-1a2b-4c3d-9e0f-123456789abc' })
  id: string;

  @ApiProperty({ example: 'Pizza Palace' })
  name: string;

  @ApiProperty({ example: 'Best pizza in town' })
  description: string;

  @ApiProperty({ example: '180/77 Nguyen Huu Canh' })
  address: string;

  @ApiProperty({ example: 'https://example.com/pizza.jpg' })
  imageUrl: string;

  @ApiProperty({ type: [String], example: [] })
  menu: string[];
}
