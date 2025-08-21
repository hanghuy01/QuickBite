import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

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
  @IsNumber()
  userId: number;

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

export class OrderResponseDto {
  @ApiProperty({ example: 'e1a6c7d2-1234-4567-89ab-9876543210ff' })
  id: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 250000 })
  totalAmount: number;

  @ApiProperty({ example: '2025-08-21T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-21T11:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({
    example: { id: 55, name: 'Pizza Palace' },
    description: 'Restaurant information',
  })
  restaurant: any;

  @ApiProperty({
    example: { id: 101, email: 'user@gmail.com', name: 'Huy' },
    description: 'User who placed the order',
  })
  user: any;
}
