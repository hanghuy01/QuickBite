import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  restaurantId: number;

  @IsArray()
  items: { menuItemId: number; quantity: number }[];
}
