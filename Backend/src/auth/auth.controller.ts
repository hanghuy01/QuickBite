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
import { JwtRequest } from './types';
import { Public } from '@/decorator/customize';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { User } from './entities/user.entity';

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
  async register(@Body() dto: RegisterDto) {
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
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @Public()
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.getNewAccessToken(refreshToken);
  }

  @Get('profile')
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
  getProfile(@Request() req: JwtRequest) {
    const userId = req.user.userId; // Lấy từ JWT payload
    return this.authService.getProfile(userId);
  }
}
