import { IsEmail, IsOptional, MinLength } from 'class-validator';

/**
 * Notes: 
 * password, email should be updated seperately and more secure business
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  name?: string;
}
