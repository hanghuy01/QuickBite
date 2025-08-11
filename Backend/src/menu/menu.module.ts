import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsService } from './menu.service';
import { MenuItemsController } from './menu.controller';
import { MenuItem } from './entities/menu-item.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Restaurant])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}
