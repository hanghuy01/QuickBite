import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { In, Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@/common/enums';

describe('AuthService Integration (E2E)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // hoặc AuthModule nếu muốn chỉ test module này
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));

    // Xóa các user test cũ trước khi chạy test
    const testEmails = [
      'testuser@gmail.com',
      'login@gmail.com',
      'profileuser@gmail.com',
    ];

    await userRepository.delete({
      email: In(testEmails),
    });
  });

  afterAll(async () => {
    // Chỉ xóa user test vừa tạo, giữ lại các user khác
    const testEmails = [
      'testuser@gmail.com',
      'loginuser@gmail.com',
      'profileuser@gmail.com',
    ];

    await userRepository.delete({
      email: In(testEmails),
    });

    await app.close();
  });

  it('should register a new user', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testuser@gmail.com',
        password: 'Str0ngP@ssword!',
        name: 'Test User',
        role: 'USER',
      })
      .expect(201);

    expect(res.body).toHaveProperty('message', 'User registered successfully');

    const user = await userRepository.findOne({
      where: { email: 'testuser@gmail.com' },
    });
    expect(user).toBeDefined();
    expect(user?.name).toBe('Test User');
  });

  it('should login an existing user', async () => {
    // first, create user manually
    const hashedPassword = await bcrypt.hash('Str0ngP@ssword!', 10);
    const user = userRepository.create({
      email: 'loginuser@gmail.com',
      name: 'Login User',
      password: hashedPassword,
      role: UserRole.USER,
    });
    await userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'loginuser@gmail.com',
        password: 'Str0ngP@ssword!',
      })
      .expect(201);

    // Define response interface for type-safe access
    interface LoginResponse {
      user: { id: string; email: string; name: string; role: string };
      access_token: string;
      refresh_token: string;
    }

    const body = res.body as LoginResponse;

    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('refresh_token');
    expect(body.user.email).toBe('loginuser@gmail.com');
  });

  it('should get user profile', async () => {
    // first, create user manually
    const hashedPassword = await bcrypt.hash('ProfileP@ss!', 10);
    const user = userRepository.create({
      email: 'profileuser@gmail.com',
      name: 'Profile User',
      password: hashedPassword,
      role: UserRole.USER,
    });
    await userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .get(`/auth/profile/${user.id}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', user.id);
    expect(res.body).toHaveProperty('email', 'profileuser@gmail.com');
    expect(res.body).toHaveProperty('name', 'Profile User');
  });
});
