import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { MenuItemsModule } from '@/modules/menu/menu.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // ❗ Đừng bật ở production
      }),
    }),
    AuthModule,
    UsersModule,
    MenuItemsModule,
    OrdersModule,
    RestaurantsModule,
  ],
})
export class AppModule {}
