import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4' })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  name?: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  role: string;
}
