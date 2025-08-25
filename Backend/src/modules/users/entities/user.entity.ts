import { Order } from '@/modules/orders/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

/**
 * Notes:
 * id, createdAt, updatedAt should be in a base entity -> inherit from base
 * id should be uuid in most case, for int for non-risk entity
 * role to enum, should have default value
 * entity name plural is fine, but it's better to be singular for new project
 * For entity, we can add response type for swagger
 * Password can be excluded from response with class transformer
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  role?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
