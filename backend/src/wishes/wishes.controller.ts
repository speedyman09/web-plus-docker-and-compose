import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.entity';
import { RemoveUserInfoFromWishInterceptor } from './interceptors/removeUserInfoFromWish.interceptor';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  async getLastWishes() {
    return await this.wishesService.getLastWishes();
  }

  @Get('top')
  async getTopWishes() {
    return await this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishesService.create(user, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(RemoveUserInfoFromWishInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishesService.update(+id, updateWishDto, user);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(RemoveUserInfoFromWishInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() { user }: { user: User }) {
    return await this.wishesService.remove(+id, user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishesService.copyWish(+id, user);
  }
}
