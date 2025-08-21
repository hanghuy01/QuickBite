import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  name?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'huy@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Huy' })
  name: string;

  @ApiProperty({ example: '2025-08-21T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-21T10:35:00.000Z' })
  updatedAt: string;
}
