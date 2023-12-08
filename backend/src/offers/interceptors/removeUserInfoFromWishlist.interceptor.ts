import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Offer } from '../entities/offer.entity';

@Injectable()
export class RemoveUserInfoFromOfferInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Offer | Offer[]) => {
        if (Array.isArray(data)) {
          data.map((offer) => {
            delete offer.user.password;
            delete offer.user.email;

            offer.user.wishes.map((wish) => {
              delete wish.owner.password;
              delete wish.owner.email;
            });

            offer.user.offers.map((offer) => {
              delete offer.user.password;
              delete offer.user.email;
            });

            offer.user.wishlists.map((wishlist) => {
              delete wishlist.owner.password;
              delete wishlist.owner.email;
            });
            delete offer.item.owner.password;
            delete offer.item.owner.email;
            return offer;
          });
        } else {
          delete data.user.password;
          delete data.user.email;

          data.user.wishes.map((wish) => {
            delete wish.owner.password;
            delete wish.owner.email;
          });

          data.user.offers.map((offer) => {
            delete offer.user.password;
            delete offer.user.email;
          });

          data.user.wishlists.map((wishlist) => {
            delete wishlist.owner.password;
            delete wishlist.owner.email;
          });

          delete data.item.owner.password;
          delete data.item.owner.email;
        }

        return data;
      }),
    );
  }
}
