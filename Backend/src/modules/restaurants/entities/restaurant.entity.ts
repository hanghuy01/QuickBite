import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { MenuItem } from '@/modules/menu/entities/menu-item.entity';
import { Order } from '@/modules/orders/entities/order.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column('json', { nullable: true })
  location: {
    latitude: number;
    longitude: number;
  };

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  menuItems: MenuItem[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
