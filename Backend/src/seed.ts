import { DataSource } from 'typeorm';
import { seedRestaurants } from './seeds/restaurant.seed';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { MenuItem } from '@/modules/menu/entities/menu-item.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Order } from '@/modules/orders/entities/order.entity';

/**
 * Not expose sensitive data
 */
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'postgres',
  password: '123123',
  database: 'quickbite',
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
