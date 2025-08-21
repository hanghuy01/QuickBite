import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

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
  image?: string;

  @IsOptional()
  location?: { latitude?: number; longitude?: number };

  @ApiProperty({
    example: '40.7128',
    description: 'Updated latitude of the restaurant',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  lat?: string;

  @ApiProperty({
    example: '-74.0060',
    description: 'Updated longitude of the restaurant',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  lon?: string;
}
