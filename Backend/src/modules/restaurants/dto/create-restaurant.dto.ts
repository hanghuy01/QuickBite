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
