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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.entity';
import { RemoveUserInfoFromWishlistInterceptor } from './interceptors/removeUserInfoFromWishlist.interceptor';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseInterceptors(RemoveUserInfoFromWishlistInterceptor)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  @UseInterceptors(RemoveUserInfoFromWishlistInterceptor)
  async findAll() {
    return await this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(RemoveUserInfoFromWishlistInterceptor)
  async findOne(@Param('id') id: string) {
    return await this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(RemoveUserInfoFromWishlistInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishlistsService.update(+id, updateWishlistDto, user);
  }

  @Delete(':id')
  @UseInterceptors(RemoveUserInfoFromWishlistInterceptor)
  async remove(@Param('id') id: string, @Req() { user }: { user: User }) {
    return await this.wishlistsService.remove(+id, user);
  }
}
