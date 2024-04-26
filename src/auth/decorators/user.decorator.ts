import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req['user']) {
      throw new InternalServerErrorException('User not found in request');
    }
    return req['user'];
  },
);
