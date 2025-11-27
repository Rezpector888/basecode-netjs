import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Stream from 'stream';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          data instanceof Buffer ||
          data instanceof Stream ||
          data?.pipe ||
          typeof data === 'string'
        ) {
          return data;
        }

        try {
          return JSON.parse(
            JSON.stringify(data, (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            ),
          );
        } catch {
          return data;
        }
      }),
    );
  }
}
