import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/**
 * https://docs.nestjs.com/custom-decorators
 */
export const ReqUser = createParamDecorator(
  <T extends keyof Express.User>(data: T, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { user } = request;

    return data ? user?.[data] : user;
  },
);
