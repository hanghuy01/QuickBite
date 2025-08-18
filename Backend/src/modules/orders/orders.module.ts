import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { User } from '@/auth/entities/user.entity';
import { Restaurant } from '@/modules/restaurants/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Restaurant])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
