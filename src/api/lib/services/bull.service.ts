import { AppConfig, RedisConfig } from '@environment';
import { BullRootModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BullService implements SharedBullConfigurationFactory {
  constructor(
    private redisConfig: RedisConfig,
  ) {}

  async createSharedConfiguration(): Promise<BullRootModuleOptions> {
    return {
      redis: {
        host: this.redisConfig.host,
        port: this.redisConfig.port,
        password: this.redisConfig.password,
      },
      prefix: this.redisConfig.prefix,
    };
  }
}
