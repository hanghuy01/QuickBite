import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import {
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { REDIS_CLIENT } from '@/modules/redis/redis.provider';
import { UserRole } from '@/common/enums';
import {
  hashPasswordHelper,
  comparePasswordHelper,
} from '@/common/helpers/util';

jest.mock('@/common/helpers/util', () => ({
  hashPasswordHelper: jest.fn(),
  comparePasswordHelper: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  let userRepository: jest.Mocked<Repository<User>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;
  let redisClient: jest.Mocked<Redis>;

  const mockUser: User = {
    id: '1',
    email: 'test@gmail.com',
    name: 'Huy',
    password: 'hashedpassword',
    role: UserRole.USER,
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
        {
          provide: REDIS_CLIENT,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
    redisClient = module.get(REDIS_CLIENT);
    jest.clearAllMocks();
  });

  describe('validateRefreshToken', () => {
    it('should throw if token not match', async () => {
      redisClient.get.mockResolvedValue(null);
      await expect(service.validateRefreshToken('1', 'token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should not throw if token match', async () => {
      redisClient.get.mockResolvedValue('token');
      await expect(
        service.validateRefreshToken('1', 'token')
      ).resolves.toBeUndefined();
    });
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(await service.validateUser('x@gmail.com', '123')).toBeNull();
    });

    it('should return null if password not valid', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      (comparePasswordHelper as jest.Mock).mockResolvedValue(false);
      expect(
        await service.validateUser(mockUser.email, 'wrongpass')
      ).toBeNull();
    });

    it('should return user if valid', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      (comparePasswordHelper as jest.Mock).mockResolvedValue(true);
      expect(await service.validateUser(mockUser.email, '123456')).toEqual(
        mockUser
      );
    });
  });

  describe('register', () => {
    it('should throw ConflictException if email exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      await expect(
        service.register({
          email: mockUser.email,
          password: '123',
          name: 'Huy',
          role: UserRole.USER,
        })
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      (hashPasswordHelper as jest.Mock).mockResolvedValue('hashed');
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.register({
        email: mockUser.email,
        password: '123',
        name: 'Huy',
        role: UserRole.USER,
      });
      expect(result).toEqual({ message: 'User registered successfully' });
      // save phải đc gọi ít nhất 1 lần
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return tokens and save refresh token to redis', async () => {
      const result = await service.login(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(redisClient.set).toHaveBeenCalledWith(
        `refresh:${mockUser.id}`,
        expect.any(String),
        'EX',
        7 * 24 * 60 * 60
      );
    });
  });

  describe('getNewAccessToken', () => {
    it('should return new access token', () => {
      const payload = {
        sub: '1',
        email: 'test@gmail.com',
        role: UserRole.USER,
      };
      const result = service.getNewAccessToken(payload);
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      expect(await service.getProfile('1')).toEqual(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.getProfile('99')).rejects.toThrow(NotFoundException);
    });
  });
});
