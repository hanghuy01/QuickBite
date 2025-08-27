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
import { Roles } from '@/auth/passport/guard/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MenuItem } from './entities/menu-item.entity';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new menu item (Admin only)' })
  @ApiBody({ type: CreateMenuItemDto })
  @ApiResponse({
    status: 201,
    description: 'Menu item created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Margherita Pizza',
        price: 120000,
        image: 'https://example.com/images/pizza.jpg',
        description: 'Classic Italian pizza with mozzarella and basil',
        restaurant: {
          id: 5,
          name: 'Pizza Palace',
        },
        createdAt: '2025-08-21T10:30:00.000Z',
        updatedAt: '2025-08-21T10:30:00.000Z',
      },
    },
  })
  create(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({
    status: 200,
    description: 'List of menu items',
    schema: {
      example: [
        {
          id: 1,
          name: 'Margherita Pizza',
          price: 120000,
          image: 'https://example.com/images/pizza.jpg',
          description: 'Classic Italian pizza with mozzarella and basil',
          restaurant: {
            id: 5,
            name: 'Pizza Palace',
          },
        },
      ],
    },
  })
  findAll(): Promise<MenuItem[]> {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Menu item found',
    schema: {
      example: {
        id: 1,
        name: 'Margherita Pizza',
        price: 120000,
        image: 'https://example.com/images/pizza.jpg',
        description: 'Classic Italian pizza with mozzarella and basil',
        restaurant: {
          id: 5,
          name: 'Pizza Palace',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu item by ID (Admin only)' })
  @ApiBody({ type: UpdateMenuItemDto })
  @ApiResponse({
    status: 200,
    description: 'Menu item updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto
  ): Promise<MenuItem> {
    return this.menuItemsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu item by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Menu item deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.menuItemsService.remove(+id);
  }
}
