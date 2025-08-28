import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from '@/common/types/payloads';
import { Public } from '@/common/decorator/customize';
import { LocalAuthGuard } from './passport/guard/local-auth.guard';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './passport/guard/jwt-auth.guard';
import { RefreshAuthGuard } from './passport/guard/refresh-auth.guard';
import { CurrentUser } from '@/common/decorator/current-user.decorator';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User registered successfully',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful with JWT token',
    schema: {
      example: {
        user: {
          id: '68877a2b82aae013b94fee3e',
          email: 'test@gmail.com',
          name: 'Huy',
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(
    @Body() dto: LoginDto,
    @Request() req: { user: User }
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @Public() // bỏ qua global JwtAuthGuard
  @UseGuards(RefreshAuthGuard) // validate refresh token
  @ApiOperation({ summary: 'Post new access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully generated new access token',
    schema: {
      example: {
        access_token: 'newAccessTokenHere...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refresh(@CurrentUser() payload: JwtPayload): { access_token: string } {
    const { sub, email, role } = payload;
    return this.authService.getNewAccessToken({ sub, email, role });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token') // 👈 cần token
  @ApiOperation({ summary: 'Get user profile from JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile',
    schema: {
      example: {
        id: '68877a2b82aae013b94fee3e',
        email: 'test@gmail.com',
        name: 'Huy',
        role: 'USER',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getProfile(@CurrentUser() payload: JwtPayload): Promise<UserResponseDto> {
    return this.authService.getProfile(payload.sub);
  }
}
