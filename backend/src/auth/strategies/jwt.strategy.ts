import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { UsersService } from './../../users/users.service';
import { jwtConstants } from '../../utils/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findOne(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
