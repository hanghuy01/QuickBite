import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './create-order.dto';
import { OrderStatus } from '@/common/enums';
import { Column } from 'typeorm';

export class OrderResponseDto {
  @ApiProperty({ example: 'e1a6c7d2-1234-4567-89ab-9876543210ff' })
  id: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ example: 'pending' })
  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ example: 250000 })
  totalAmount: number;

  @ApiProperty({ example: '2025-08-21T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-21T11:00:00.000Z' })
  updatedAt: Date;

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
