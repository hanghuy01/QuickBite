import { OrderStatus } from '@/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'confirmed',
    description: 'Order status (pending, confirmed, delivered, cancelled)',
  })
  @IsOptional()
  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;
}
