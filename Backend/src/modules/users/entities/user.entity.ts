import { BaseEntity } from '@/common/entities/base.entity';
import { UserRole } from '@/common/enums';
import { Order } from '@/modules/orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Entity, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'john@example.com' })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @Column({ nullable: true })
  name?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
