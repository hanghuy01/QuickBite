import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { MenuItemsService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu.dto';
import { UpdateMenuItemDto } from './dto/update-menu.dto';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuItemsService.create(dto);
  }

  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuItemsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(+id);
  }
}
