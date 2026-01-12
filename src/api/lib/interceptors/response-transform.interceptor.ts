import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  paginate: any;
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const type = context.getType();
    if (type == 'http') {
      return next.handle().pipe(
        map((response: any) => {
          const additional = response?.additional || null;

          const mappedResponse: any = {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: response?.message,
            paginate: response?.meta,
            data: null,
          };
          if (response?.message) delete response.message;
          if (response?.paginate) delete response.paginate;
          if (additional && Object.keys(additional).length > 0) {
            mappedResponse.additional = additional;
          }
          if (Object.entries(mappedResponse.paginate).length == 1) delete mappedResponse.paginate;
          mappedResponse.data = response?.data ? response.data : response;
          if (Object.keys(mappedResponse.data ?? {}).length === 0) {
            mappedResponse.data = null;
          }

          delete mappedResponse?.data?.additional;
          return mappedResponse;
        }),
      );
    }
    return next.handle().pipe();
  }
}
