import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  IsInt,
  Length,
  IsDefined,
  IsUrl,
  IsPositive,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from './../../users/entities/user.entity';
import { Offer } from './../../offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsDefined()
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsPositive()
  @IsNumber()
  price: number;

  @Column({
    default: 0,
  })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  @IsInt()
  @IsPositive()
  copied: number;
}
