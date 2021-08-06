import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfig, Path, PathValue } from '@nestjs/config';

import { Config } from './config.interface';

@Injectable()
export class ConfigService<T extends Config> extends NestConfig<T> {
  public override get<P extends Path<T>>(path: P): PathValue<T, P> {
    const value = super.get(path, { infer: true });

    if (value === undefined) {
      throw new Error(`NotFoundConfig: ${path}`);
    }

    return value;
  }
}
