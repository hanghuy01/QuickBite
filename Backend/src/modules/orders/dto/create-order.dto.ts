import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID of the menu item' })
  menuItemId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the menu item' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 101,
    description: 'ID of the user placing the order',
  })
  @IsString()
  userId: string;

  @ApiProperty({ example: 55, description: 'ID of the restaurant' })
  @IsNumber()
  restaurantId: number;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    type: [OrderItemDto],
    example: [
      { menuItemId: 1, quantity: 2 },
      { menuItemId: 5, quantity: 1 },
    ],
    description: 'List of ordered menu items with quantity',
  })
  @IsArray()
  items: OrderItemDto[];
}
