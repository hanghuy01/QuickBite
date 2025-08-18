import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

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
  @IsUrl()
  imageUrl?: string;
}
