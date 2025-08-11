import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenuItem } from '../../menu/entities/menu-item.entity';
import { Order } from '@/orders/entities/order.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant, {
    cascade: true,
  })
  menuItems: MenuItem[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];
}
