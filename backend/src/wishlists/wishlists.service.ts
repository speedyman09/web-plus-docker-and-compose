import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { INCORRECT_OWNER, WISHLIST_NOT_FOUND } from 'src/utils/constants';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const { name, items, description, image } = createWishlistDto;
    const wishes = await this.wishesService.findMany(items);
    return this.wishlistRepository.save({
      name,
      items: wishes,
      description,
      image,
      owner: user,
    });
  }

  async findAll() {
    return this.wishlistRepository.find({ relations: ['owner', 'items'] });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const { name, items, description, image } = updateWishlistDto;
    let wishes: Wish[];
    if (items) {
      wishes = await this.wishesService.findMany(items);
    }
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException(INCORRECT_OWNER);
    }

    await this.wishlistRepository.save({
      id,
      name,
      items: wishes,
      description,
      image,
    });

    //возвращается вишлист через поиск, т.к. save не возвращает связанные таблицы
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException(INCORRECT_OWNER);
    }

    return await this.wishlistRepository.remove(wishlist);
  }
}
