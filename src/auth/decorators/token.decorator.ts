import {
    ExecutionContext,
    InternalServerErrorException,
    createParamDecorator,
  } from '@nestjs/common';
  
  export const GetToken = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      if (!req['token']) {
        throw new InternalServerErrorException('token not found in request');
      }
      return req['token'];
    },
  );
  