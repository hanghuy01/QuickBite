import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenuItem } from '@/modules/menu/entities/menu-item.entity';
import { Order } from '@/modules/orders/entities/order.entity';


// Consider address & location should be in one
// Be warning when using cascade, it could occur unnecessary queries
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
}
