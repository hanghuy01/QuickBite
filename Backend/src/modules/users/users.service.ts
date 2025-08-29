import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) {}

  create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UpdateResult> {
    const result = await this.usersRepo.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return result; // UpdateResult (không có entity)
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepo.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
