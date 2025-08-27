import { DataSource } from 'typeorm';
import { seedRestaurants } from './seeds/restaurant.seed';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { MenuItem } from '@/modules/menu/entities/menu-item.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [Restaurant, MenuItem, User, Order],
  synchronize: true, // ⚠️ Chỉ dùng sync trong dev, tránh dùng production
  logging: false,
});

AppDataSource.initialize()
  .then(async (dataSource) => {
    await seedRestaurants(dataSource);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
