import { Global, Module } from '@nestjs/common';

import { Logger, RequestContext } from './services';

@Global()
@Module({
  providers: [Logger, RequestContext],
  exports: [Logger, RequestContext],
})
export class CommonModule {}
