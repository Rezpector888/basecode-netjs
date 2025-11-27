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
            status_code: context.switchToHttp().getResponse().statusCode,
            message: response?.message,
            paginate: response?.meta,
            data: null,
          };
          const mappedPaginate = {
            total: response?.meta?.total,
            last_page: response?.meta?.lastPage,
            current_page: response?.meta?.currentPage,
            per_page: response?.meta?.perPage,
            prev: response?.meta?.prev,
            next: response?.meta?.next,
          };
          if (response?.message) delete response.message;
          if (response?.paginate) delete response.paginate;
          if (response?.meta) {
            mappedResponse.paginate = mappedPaginate;
          }
          if (additional && Object.keys(additional).length > 0) {
            mappedResponse.additional = additional;
          }

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
