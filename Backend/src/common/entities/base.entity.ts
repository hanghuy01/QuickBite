import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  @PrimaryGeneratedColumn('uuid') // 🔥 UUID an toàn hơn
  id: string;

  @ApiProperty({ example: '2025-08-26T12:34:56.789Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-08-26T12:34:56.789Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
