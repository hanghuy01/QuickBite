import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';

class LocationDto {
  @ApiProperty({ example: 40.7128 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -74.006 })
  @IsNumber()
  longitude: number;
}

export class UpdateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Palace (Updated)',
    description: 'The updated name of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Italian',
    description: 'Updated category of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Updated description of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '456 New Street',
    description: 'Updated address of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'https://example.com/pizza-new.jpg',
    description: 'Updated image URL of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({ required: false })
  @IsOptional()
  deletedAt?: Date;
}
