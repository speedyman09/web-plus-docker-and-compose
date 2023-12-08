import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class RemoveUserInfoFromUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: User | User[]) => {
        if (Array.isArray(data)) {
          data.map((user) => {
            delete user.password;
            delete user.email;
            return user;
          });
        } else {
          delete data.password;
          delete data.email;
        }

        return data;
      }),
    );
  }
}
