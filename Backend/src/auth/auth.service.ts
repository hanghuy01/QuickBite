import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import {
  comparePasswordHelper,
  hashPasswordHelper,
} from '@/common/helpers/util';
import { User } from './entities/user.entity';
import { REDIS_CLIENT } from '@/redis/redis.provider';
import { JwtPayload } from '@/common/types/payloads';
import { LoginResponseDto } from './dto/login.dto';
import { UserRole } from '@/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private config: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis
  ) {}

  async validateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const storedToken = await this.redisClient.get(`refresh:${userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(
      password,
      user.password
    );
    if (!isValidPassword) return null;

    return user;
  }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const { email, password, name, role } = dto;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword: string = await hashPasswordHelper(password);
    const user = this.userRepository.create({
      email,
      name,
      role: role || UserRole.USER,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_TOKEN_EXPIRED'),
    });

    // 👉 Lưu refreshToken vào Redis (key = userId)
    await this.redisClient.set(
      `refresh:${user.id}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60 // 7 ngày
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  getNewAccessToken(payload: JwtPayload): { access_token: string } {
    const { sub, email, role } = payload;

    return {
      access_token: this.jwtService.sign({ sub, email, role }),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
