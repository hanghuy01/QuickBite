import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>
  ) {}

  async create(dto: CreateMenuItemDto) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const menuItem = this.menuItemRepo.create({
      ...dto,
      restaurant,
    });

    return this.menuItemRepo.save(menuItem);
  }

  findAll() {
    return this.menuItemRepo.find({ relations: ['restaurant'] });
  }

  async findOne(id: number) {
    const menuItem = await this.menuItemRepo.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    if (!menuItem) throw new NotFoundException('Menu item not found');
    return menuItem;
  }

  async update(id: number, dto: UpdateMenuItemDto) {
    const menuItem = await this.findOne(id);

    if (dto.restaurantId) {
      const restaurant = await this.restaurantRepo.findOne({
        where: { id: dto.restaurantId },
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
      menuItem.restaurant = restaurant;
    }

    Object.assign(menuItem, dto);
    return this.menuItemRepo.save(menuItem);
  }

  async remove(id: number) {
    const menuItem = await this.menuItemRepo.findOne({ where: { id } });
    if (!menuItem) throw new NotFoundException('Menu item not found');

    await this.menuItemRepo.remove(menuItem);
  }
}
