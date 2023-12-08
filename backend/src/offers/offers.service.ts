import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import {
  INTERNAL_SERVER_ERROR,
  OFFER_FROM_OWNER,
  OFFER_NOT_FOUND,
  RAISED_MORE_THAN_PRICE,
  WISH_ALREADY_FUNDED,
  WISH_NOT_FOUND,
} from 'src/utils/constants';
import { User } from 'src/users/entities/user.entity';
import { getRaised } from 'src/utils/utils';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const item = await this.wishesService.findOne(createOfferDto.item);

      if (!item) {
        throw new NotFoundException(WISH_NOT_FOUND);
      }

      //пользователю нельзя вносить деньги на собственные подарки
      if (item.owner.id === user.id) {
        throw new BadRequestException(OFFER_FROM_OWNER);
      }

      //нельзя скинуться на подарки, на которые уже собраны деньги
      if (item.price === item.raised) {
        throw new BadRequestException(WISH_ALREADY_FUNDED);
      }

      const updatedRaised = getRaised(item.raised, createOfferDto.amount);

      //сумма собранных средств не может превышать стоимость подарка
      if (updatedRaised > item.price) {
        throw new BadRequestException(RAISED_MORE_THAN_PRICE);
      }

      await this.wishesService.setRaised(item.id, updatedRaised);

      await this.offerRepository.save({ ...createOfferDto, item, user });

      await queryRunner.commitTransaction();

      return null;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err?.message) {
        throw err;
      } else throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offerRepository.find({
      relations: [
        'item',
        'user',
        'item.owner',
        'item.offers',
        'user.wishes',
        'user.wishes.owner',
        'user.offers',
        'user.offers.user',
        'user.wishlists',
        'user.wishlists.items',
        'user.wishlists.owner',
      ],
    });
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: [
        'item',
        'user',
        'item.owner',
        'item.offers',
        'user.wishes',
        'user.wishes.owner',
        'user.wishes.offers',
        'user.offers',
        'user.offers.user',
        'user.wishlists',
        'user.wishlists.items',
        'user.wishlists.owner',
      ],
    });

    if (!offer) {
      throw new NotFoundException(OFFER_NOT_FOUND);
    }

    return offer;
  }
}
