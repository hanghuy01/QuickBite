import { DataSource, DeepPartial } from 'typeorm';
import { Restaurant } from '@/restaurants/entities/restaurant.entity';
import { MenuItem } from '@/menu/entities/menu-item.entity';
import { User } from '@/users/entities/user.entity';
import { hashPasswordHelper } from '@/helpers/util';

export async function seedRestaurants(dataSource: DataSource) {
  const restaurantRepo = dataSource.getRepository(Restaurant);
  const userRepo = dataSource.getRepository(User);

  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    console.log('🗑 Clearing old data...');
    await dataSource.query('TRUNCATE TABLE menu_item RESTART IDENTITY CASCADE');
    await dataSource.query(
      'TRUNCATE TABLE restaurant RESTART IDENTITY CASCADE'
    );
  }

  // 👉 Seed user mặc định
  const adminEmail = 'Admin@gmail.com';
  const adminExists = await userRepo.findOne({ where: { email: adminEmail } });
  if (!adminExists) {
    const hashedPassword = await hashPasswordHelper('123123');
    const admin = userRepo.create({
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    } as DeepPartial<User>);
    await userRepo.save(admin);
    console.log('👤 Seeded admin user');
  }

  const restaurants = [
    {
      name: 'Pizza Palace',
      category: 'Pizza',
      address: '180/77 Nguyen Huu Canh, Binh Thanh',
      location: {
        latitude: 10.794188,
        longitude: 106.719147,
      },
      image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
      menu: [
        {
          name: 'Pepperoni Pizza',
          price: 9.99,
          image:
            'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
        },
        {
          name: 'Cheese Pizza',
          price: 8.99,
          image:
            'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg',
        },
        {
          name: 'Caribbean Pizza',
          price: 9.99,
          image:
            'https://images.pexels.com/photos/33384416/pexels-photo-33384416.jpeg',
        },
        {
          name: 'Tandoori Chicken Pizza',
          price: 8.99,
          image:
            'https://images.pexels.com/photos/5639548/pexels-photo-5639548.jpeg',
        },
      ],
    },
    {
      name: 'Sushi World',
      category: 'Sushi',
      address: '16 Ung Van Khiem, Binh Thanh',
      location: {
        latitude: 10.80013,
        longitude: 106.723538,
      },
      image: 'https://images.pexels.com/photos/246747/pexels-photo-246747.jpeg',
      menu: [
        {
          name: 'Salmon Roll',
          price: 12.99,
          image:
            'https://images.pexels.com/photos/8951267/pexels-photo-8951267.jpeg',
        },
        {
          name: 'Tuna Roll',
          price: 11.99,
          image:
            'https://images.pexels.com/photos/11064619/pexels-photo-11064619.jpeg',
        },
        {
          name: 'Chicken Teriyaki',
          price: 10.99,
          image:
            'https://images.pexels.com/photos/19160952/pexels-photo-19160952.jpeg',
        },
        {
          name: 'Chicken Teriyaki',
          price: 10.99,
          image:
            'https://images.pexels.com/photos/19160952/pexels-photo-19160952.jpeg',
        },
        {
          name: 'Chicken Teriyaki',
          price: 10.99,
          image:
            'https://images.pexels.com/photos/19160952/pexels-photo-19160952.jpeg',
        },
      ],
    },
    {
      name: 'Drink Hub',
      category: 'Drinks',
      address: '103 Ngô Tất Tố, Binh Thanh',
      location: {
        latitude: 10.792427,
        longitude: 106.71308,
      },
      image: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg',
      menu: [
        {
          name: 'Iced Coffee',
          price: 3.5,
          image:
            'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg',
        },
        {
          name: 'Lemon Tea',
          price: 2.8,
          image:
            'https://images.pexels.com/photos/15865526/pexels-photo-15865526.jpeg',
        },
      ],
    },
    {
      name: 'Pizza Don',
      category: 'Pizza',
      address: '300 Cong Hoa, Tan Binh',
      location: {
        latitude: 10.802366,
        longitude: 106.646387,
      },
      image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
      menu: [
        {
          name: 'Pepperoni Pizza',
          price: 9.99,
          image:
            'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
        },
        {
          name: 'Cheese Pizza',
          price: 8.99,
          image:
            'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg',
        },
      ],
    },
    {
      name: 'Sushi 4P',
      category: 'Sushi',
      address: '300 Cong Hoa, Tan Binh',
      location: {
        latitude: 10.802366,
        longitude: 106.646387,
      },
      image:
        'https://images.pexels.com/photos/8951267/pexels-photo-8951267.jpeg',
      menu: [
        {
          name: 'Salmon Roll',
          price: 12.99,
          image:
            'https://images.pexels.com/photos/8951267/pexels-photo-8951267.jpeg',
        },
        {
          name: 'Tuna Roll',
          price: 11.99,
          image:
            'https://images.pexels.com/photos/11064619/pexels-photo-11064619.jpeg',
        },
        {
          name: 'Chicken Teriyaki',
          price: 10.99,
          image:
            'https://images.pexels.com/photos/19160952/pexels-photo-19160952.jpeg',
        },
      ],
    },
    {
      name: 'Drink 4U',
      category: 'Drinks',
      address: '300 Cong Hoa, Tan Binh',
      location: {
        latitude: 10.802366,
        longitude: 106.646387,
      },
      image:
        'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg',
      menu: [
        {
          name: 'Iced Coffee',
          price: 3.5,
          image:
            'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg',
        },
        {
          name: 'Lemon Tea',
          price: 2.8,
          image:
            'https://images.pexels.com/photos/15865526/pexels-photo-15865526.jpeg',
        },
      ],
    },
  ];

  for (const r of restaurants) {
    // Nếu không reset thì tránh insert trùng
    if (!shouldReset) {
      const exists = await restaurantRepo.findOne({ where: { name: r.name } });
      if (exists) continue;
    }

    const restaurant = restaurantRepo.create({
      name: r.name,
      category: r.category,
      image: r.image,
      address: r.address,
      location: r.location,
      menuItems: r.menu.map((m) => {
        const menuItem = new MenuItem();
        menuItem.name = m.name;
        menuItem.price = m.price;
        menuItem.image = m.image;
        return menuItem;
      }),
    } as DeepPartial<Restaurant>);
    await restaurantRepo.save(restaurant);
  }

  console.log('✅ Seeded restaurants & menus');
}
