import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from 'src/hash/hash.service';
import {
  ANOTHER_USER_WITH_THIS_DATA,
  USER_NOT_FOUND,
} from 'src/utils/constants';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, avatar, about } = createUserDto;

    const existingUserByEmail = await this.userRepository.findOneBy({ email });
    const existinguserByName = await this.userRepository.findOneBy({
      username,
    });

    if (existingUserByEmail || existinguserByName) {
      throw new BadRequestException(ANOTHER_USER_WITH_THIS_DATA);
    }

    const hashedPassword = await this.hashService.getHash(
      createUserDto.password,
    );

    const userData = {
      password: hashedPassword,
      username,
      email,
      avatar,
      about,
    };
    return await this.userRepository.save(userData);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const anotherUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (anotherUser) {
        throw new BadRequestException(ANOTHER_USER_WITH_THIS_DATA);
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.getHash(
        updateUserDto.password,
      );
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const anotherUser = await this.findOneByUsername(updateUserDto.username);
      if (anotherUser) {
        throw new BadRequestException(ANOTHER_USER_WITH_THIS_DATA);
      }
    }

    return await this.userRepository.save({ ...user, ...updateUserDto });
  }

  async findMany(query: string) {
    const searchResult = await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });

    return searchResult;
  }

  async findUserWishes(id: number) {
    return await this.wishRepository.find({
      where: { owner: { id } },
      relations: [
        'offers',
        'offers.user',
        'offers.item',
        'offers.item.owner',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }
}
