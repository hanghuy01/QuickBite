import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '@/restaurants/entities/restaurant.entity';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  items: any[]; // [{ menuItemId: number, quantity: number }]

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, delivered, cancelled

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    eager: true,
  })
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;
}
