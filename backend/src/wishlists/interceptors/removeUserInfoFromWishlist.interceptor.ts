import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Wishlist } from '../entities/wishlist.entity';

@Injectable()
export class RemoveUserInfoFromWishlistInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Wishlist | Wishlist[]) => {
        if (Array.isArray(data)) {
          data.map((wishlist) => {
            delete wishlist.owner.password;
            delete wishlist.owner.email;
            return wishlist;
          });
        } else {
          delete data.owner.password;
          delete data.owner.email;
        }

        return data;
      }),
    );
  }
}
