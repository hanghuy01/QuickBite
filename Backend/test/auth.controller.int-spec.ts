import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, In } from 'typeorm';
import { LoginResponseDto } from '@/auth/dto/login.dto';
import { User } from '@/auth/entities/user.entity';

describe('AuthController (integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // 👉 load nguyên AppModule
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    // await dataSource.synchronize(true); // reset DB nên khi có db-test
    const emailsToDelete = [
      'testuser@gmail.com',
      'login@gmail.com',
      'profileuser@gmail.com',
      'dup@gmail.com',
    ];

    await dataSource.getRepository(User).delete({
      email: In(emailsToDelete),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'testuser@gmail.com',
          password: 'Str0ngP@ssword!',
          name: 'Huy',
          role: 'USER',
        })
        .expect(201);

      expect(res.body).toEqual({
        message: 'User registered successfully',
      });
    });

    it('should return 409 if email already exists', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'dup@gmail.com',
          password: 'Str0ngP@ssword!',
          name: 'Dup',
          role: 'USER',
        })
        .expect(201);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'dup@gmail.com',
          password: 'Str0ngP@ssword!',
          name: 'DupAgain',
          role: 'USER',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login and return tokens', async () => {
      // đăng ký trước
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'login@gmail.com',
          password: 'Str0ngP@ssword!',
          name: 'LoginUser',
          role: 'USER',
        })
        .expect(201);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login@gmail.com',
          password: 'Str0ngP@ssword!',
        })
        .expect(201);

      const body = res.body as LoginResponseDto;
      expect(body).toHaveProperty('access_token');
      expect(body).toHaveProperty('refresh_token');
      expect(body.user.email).toBe('login@gmail.com');
    });
  });
});
