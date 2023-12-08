import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Wish } from '../entities/wish.entity';

@Injectable()
export class RemoveUserInfoFromWishInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Wish | Wish[]) => {
        if (Array.isArray(data)) {
          data.map((wish) => {
            for (const offer of wish.offers) {
              delete offer.user.password;
              delete offer.user.email;
            }
            if (wish.owner) {
              delete wish.owner.password;
              delete wish.owner.email;
            }
            return wish;
          });
        } else {
          for (const offer of data.offers) {
            delete offer.user.password;
            delete offer.user.email;
          }
          if (data.owner) {
            delete data.owner.password;
            delete data.owner.email;
          }
        }

        return data;
      }),
    );
  }
}
