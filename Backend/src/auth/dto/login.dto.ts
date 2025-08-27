import { UserProfile } from '@/common/types/profile';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  user: UserProfile;

  @ApiProperty({ example: 'accessTokenHere' })
  access_token: string;

  @ApiProperty({ example: 'refreshTokenHere' })
  refresh_token: string;
}
