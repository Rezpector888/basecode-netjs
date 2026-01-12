import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const GprcUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const metadata = ctx.getArgByIndex(1);
  const user = metadata.get('user')?.[0];
  return user ? JSON.parse(user) : null;
});

export const ApiUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const ToBoolean = (): PropertyDecorator => {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return params.value;
      }
    },
    { toClassOnly: true },
  );
};
