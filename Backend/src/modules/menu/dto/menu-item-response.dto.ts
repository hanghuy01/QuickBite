import { ApiProperty } from '@nestjs/swagger';

export class MenuItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Margherita Pizza' })
  name: string;

  @ApiProperty({ example: 120000 })
  price: number;

  @ApiProperty({
    example: 'Classic Italian pizza with fresh basil',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 'https://example.com/pizza.jpg', required: false })
  image?: string;

  @ApiProperty()
  restaurantId: number;
}
