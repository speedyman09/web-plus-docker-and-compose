import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class HashService {
  async getHash(password: string) {
    const saltOrRounds = 10;
    const salt = await genSalt(saltOrRounds);
    return await hash(password, salt);
  }

  async compare(password: string, hash: string) {
    return await compare(password, hash);
  }
}
