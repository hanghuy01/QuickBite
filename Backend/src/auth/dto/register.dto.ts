import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * NOTES: 
 * Password should be strong password
 * Role should be enum
 * Name could be stricter (string is not enough, string can be empty!)
 * Would be better if using inheritance for Login & Register https://docs.nestjs.com/openapi/mapped-types
 */

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role: string;
}
