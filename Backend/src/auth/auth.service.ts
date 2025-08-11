import {
  UnauthorizedException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/util';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword: string = await hashPasswordHelper(password);
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return { message: 'User registered successfullyssss' };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await comparePasswordHelper(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
