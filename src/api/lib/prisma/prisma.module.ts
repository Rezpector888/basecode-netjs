import { Global, Module } from '@nestjs/common';
import { PrismaAppService } from './prisma-app.service';

@Global()
@Module({
  providers: [PrismaAppService],
  exports: [PrismaAppService],
})
export class PrismaModule {}
