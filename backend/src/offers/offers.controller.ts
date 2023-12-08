import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.entity';
import { RemoveUserInfoFromOfferInterceptor } from './interceptors/removeUserInfoFromWishlist.interceptor';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() { user }: { user: User },
  ) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  @UseInterceptors(RemoveUserInfoFromOfferInterceptor)
  async findAll() {
    return await this.offersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(RemoveUserInfoFromOfferInterceptor)
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }
}
