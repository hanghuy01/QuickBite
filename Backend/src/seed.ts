import { DataSource } from 'typeorm';
import { seedRestaurants } from './seeds/restaurant.seed';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { MenuItem } from './menu/entities/menu-item.entity';
import { User } from './users/entities/user.entity';
import { Order } from './orders/entities/order.entity';

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
