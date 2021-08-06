import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { Logger } from '../services';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {
    this.logger.setContext('HTTP');
  }

  public use(req: Request, res: Response, next: () => void): void {
    req.id = req.header(REQUEST_ID_TOKEN_HEADER) || nanoid();
    res.setHeader(REQUEST_ID_TOKEN_HEADER, req.id);

    const user = req.user?.id || '';
    this.logger.log(
      `${req.method} ${req.originalUrl} - ${req.ip.replace(
        '::ffff:',
        '',
      )} ${user}`,
    );

    return next();
  }
}
