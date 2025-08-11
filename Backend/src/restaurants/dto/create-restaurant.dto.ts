import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Palace',
    description: 'The name of the restaurant',
  })
  @IsString()
  name: string;

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
  @IsString()
  address: string;

  @ApiProperty({
    example: 'https://example.com/pizza.jpg',
    description: 'Image URL of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
