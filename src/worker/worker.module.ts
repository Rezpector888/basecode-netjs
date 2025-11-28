import { AppConfig, EnvironmentModule, RedisConfig } from '@environment';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@worker-lib/prisma';
import { BullService } from '@worker-lib/services';
import { NotificationModule } from '@worker-modules/notification';

@Module({
  imports: [
    PrismaModule,
    EnvironmentModule,
    BullModule.forRootAsync({
      inject: [RedisConfig, AppConfig],
      useClass: BullService,
    }),
    NotificationModule,
  ],
})
export class WorkerModule {}
