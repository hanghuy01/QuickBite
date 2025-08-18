import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  items: any[]; // [{ menuItemId: number, quantity: number }]

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, delivered, cancelled

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

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
