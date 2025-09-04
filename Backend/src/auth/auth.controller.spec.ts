import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { JwtPayload } from '@/common/types/payloads';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from '@/common/enums';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AuthController', () => {
  // chuẩn bị tài nguyên để test
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getNewAccessToken: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        email: 'test@gmail.com',
        password: 'Str0ngP@ssword!',
        name: 'Huy',
        role: UserRole.USER,
      };
      const result = { message: 'User registered successfully' };
      service.register.mockResolvedValue(result);

      expect(await controller.register(dto)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.register).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto: RegisterDto = {
        email: 'duplicate@gmail.com',
        password: 'Str0ngP@ssword!',
        name: 'Huy',
        role: UserRole.USER,
      };
      service.register.mockRejectedValue(new ConflictException());

      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should fail validation for weak password', async () => {
      const dto = plainToInstance(RegisterDto, {
        email: 'test@gmail.com',
        password: '123456',
        name: 'Huy',
        role: UserRole.USER,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const dto: LoginDto = { email: 'test@gmail.com', password: '123456' };
      const user = {
        id: '1',
        email: dto.email,
        name: 'Huy',
        role: UserRole.USER,
      } as Partial<User> as User;

      const response: LoginResponseDto = {
        user,
        access_token: 'access123',
        refresh_token: 'refresh123',
      };

      service.login.mockResolvedValue(response);

      expect(await controller.login(dto, { user })).toEqual(response);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.login).toHaveBeenCalledWith(user);
    });
  });

  describe('refresh', () => {
    it('should return new access token', () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@gmail.com',
        role: 'USER',
      };
      const result = { access_token: 'newAccessToken' };
      service.getNewAccessToken.mockReturnValue(result);

      expect(controller.refresh(payload)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getNewAccessToken).toHaveBeenCalledWith(payload);
    });

    it('should throw UnauthorizedException if refresh token invalid', () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@gmail.com',
        role: 'USER',
      };
      service.getNewAccessToken.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      expect(() => controller.refresh(payload)).toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@gmail.com',
        role: 'USER',
      };
      const result: UserResponseDto = {
        id: '1',
        email: 'test@gmail.com',
        name: 'Huy',
        role: UserRole.USER,
      };

      service.getProfile.mockResolvedValue(result);

      expect(await controller.getProfile(payload)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getProfile).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload: JwtPayload = {
        sub: '999',
        email: 'ghost@gmail.com',
        role: 'USER',
      };
      service.getProfile.mockRejectedValue(new UnauthorizedException());

      await expect(controller.getProfile(payload)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
