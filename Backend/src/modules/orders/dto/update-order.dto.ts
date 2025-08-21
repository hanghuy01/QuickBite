import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'confirmed',
    description: 'Order status (pending, confirmed, delivered, cancelled)',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
