import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsPositive, IsBoolean } from 'class-validator';
import { User } from './../../users/entities/user.entity';
import { Wish } from './../../wishes/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  item: Wish;

  @Column()
  @IsPositive()
  amount: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
