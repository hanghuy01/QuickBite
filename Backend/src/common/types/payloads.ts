import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsNumber()
  iat?: number;

  @IsOptional()
  @IsNumber()
  exp?: number;
}

export class ResponseJwtPayload {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsNumber()
  iat?: number;

  @IsOptional()
  @IsNumber()
  exp?: number;
}
