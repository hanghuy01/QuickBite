import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { MenuItemResponseDto } from './dto/menu-item-response.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>
  ) {}

  async create(dto: CreateMenuItemDto): Promise<MenuItemResponseDto> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const menuItem = this.menuItemRepo.create({
      ...dto,
      restaurant,
    });

    const saved = await this.menuItemRepo.save(menuItem);

    return {
      ...saved,
      restaurantId: saved.restaurant.id,
    };
  }

  async findAll(): Promise<MenuItemResponseDto[]> {
    const items = await this.menuItemRepo.find({
      relations: {
        restaurant: true,
      },
    });
    return items.map((item) => ({
      ...item,
      restaurantId: item.restaurant.id,
    }));
  }

  async findOne(id: number): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemRepo.findOne({
      where: { id },
      relations: {
        restaurant: true,
      },
    });
    if (!menuItem) throw new NotFoundException('Menu item not found');
    return {
      ...menuItem,
      restaurantId: menuItem.restaurant.id, // lấy id từ relation
    };
  }

  async update(id: number, dto: UpdateMenuItemDto): Promise<UpdateResult> {
    const result = await this.menuItemRepo.update(id, dto);
    if (result.affected === 0)
      throw new NotFoundException('Menu item not found');
    return result;
  }

  async remove(id: number): Promise<void> {
    const menuItem = await this.menuItemRepo.softDelete(id);
    if (!menuItem) {
      throw new NotFoundException('menuItem not found');
    }
  }
}
