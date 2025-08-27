import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({
    example: 'Margherita Pizza',
    description: 'Name of the menu item',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 120000, description: 'Price of the menu item (VND)' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'https://example.com/images/pizza.jpg',
    description: 'Image URL',
  })
  @IsNotEmpty()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'Classic Italian pizza with mozzarella and basil',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 5,
    description: 'Restaurant ID this item belongs to',
  })
  @IsNotEmpty()
  restaurantId: number;
}

export class MenuItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Margherita Pizza' })
  name: string;

  @ApiProperty({ example: 9.99 })
  price: number;

  @ApiProperty({
    example: 'Classic Italian pizza with fresh basil',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 'https://example.com/pizza.jpg', required: false })
  image?: string;

  @ApiProperty({ example: 12 })
  restaurantId: number;
}
