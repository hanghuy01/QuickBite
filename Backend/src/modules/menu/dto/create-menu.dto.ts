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
