import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository, In } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  EDITING_WISH_PRICE_WITH_OFFERS_IS_FORBIDDEN,
  INCORRECT_OWNER,
  WISH_ALREADY_COPIED,
  WISH_NOT_FOUND,
} from 'src/utils/constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    await this.wishRepository.save({ owner: user, ...createWishDto });

    return null;
  }

  async findAll() {
    return await this.wishRepository.find();
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    return wish;
  }

  async findMany(idArray: number[]) {
    const wishes = await this.wishRepository.find({
      where: { id: In(idArray) },
    });

    if (wishes.length === 0) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }
    return wishes;
  }

  async update(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (wish.owner.id !== user.id) {
      throw new BadRequestException(INCORRECT_OWNER);
    }

    if (wish.raised !== 0 && updateWishDto.price) {
      throw new BadRequestException(
        EDITING_WISH_PRICE_WITH_OFFERS_IS_FORBIDDEN,
      );
    }

    await this.wishRepository.save({ id: wish.id, ...updateWishDto });

    return null;
  }

  async remove(id: number, user: User) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (wish.owner.id !== user.id) {
      throw new BadRequestException(INCORRECT_OWNER);
    }

    return await this.wishRepository.remove(wish);
  }

  async setRaised(id: number, updatedRaised: number) {
    return await this.wishRepository.update(id, { raised: updatedRaised });
  }

  async getLastWishes() {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: ['owner'],
    });
  }

  async getTopWishes() {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: ['owner'],
    });
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    const previouslyCopiedWish = await this.wishRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        link: wish.link,
        owner: { id: user.id },
      },
    });

    if (previouslyCopiedWish) {
      throw new BadRequestException(WISH_ALREADY_COPIED);
    }

    wish.copied = wish.copied + 1;

    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;

    await this.wishRepository.save(wish);

    const copy = { ...wish, raised: 0, copied: 0, owner: user, offers: [] };

    const copiedWish = this.wishRepository.create(copy);

    await this.wishRepository.save(copiedWish);

    return null;
  }
}
