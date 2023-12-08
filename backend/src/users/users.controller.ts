import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from './entities/user.entity';
import { USER_NOT_FOUND } from 'src/utils/constants';
import { RemoveUserInfoFromUserInterceptor } from './interceptors/removeUserInfoFromUser.interceptor';
import { RemoveUserInfoFromWishInterceptor } from 'src/wishes/interceptors/removeUserInfoFromWish.interceptor';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  async getProfile(@Req() { user }: { user: User }) {
    const profile = await this.usersService.findOne(user.id);

    if (!profile) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return profile;
  }

  @Get()
  @UseInterceptors(RemoveUserInfoFromUserInterceptor)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @UseInterceptors(RemoveUserInfoFromUserInterceptor)
  async findOne(@Param('username') username: string) {
    const user = this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  @Patch('me')
  @UseInterceptors(RemoveUserInfoFromUserInterceptor)
  async update(
    @Req() { user }: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Post('find')
  @UseInterceptors(RemoveUserInfoFromUserInterceptor)
  async searchUsers(@Body() { query }: { query: string }) {
    return await this.usersService.findMany(query);
  }

  @Get('me/wishes')
  @UseInterceptors(RemoveUserInfoFromWishInterceptor)
  async getProfileWishes(@Req() { user }: { user: User }) {
    return await this.usersService.findUserWishes(+user.id);
  }

  @Get(':username/wishes')
  @UseInterceptors(RemoveUserInfoFromWishInterceptor)
  async getUsernameWishes(@Param('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return await this.usersService.findUserWishes(+user.id);
  }
}
