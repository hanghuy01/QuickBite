import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  restaurantId: number;
}
