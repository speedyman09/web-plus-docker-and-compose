import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from 'src/hash/hash.module';
import { Wish } from 'src/wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), HashModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
