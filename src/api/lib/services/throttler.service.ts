import { ThrottlerConfig } from '@environment';
import { Injectable } from '@nestjs/common';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private throttlerConfig: ThrottlerConfig) {}

  async createThrottlerOptions(): Promise<ThrottlerModuleOptions> {
    return {
      throttlers: [
        {
          limit: this.throttlerConfig.limit,
          ttl: this.throttlerConfig.ttl,
        },
      ],
      errorMessage(context, throttlerLimitDetail) {
        return `Request limit exceeded. Please retry after ${throttlerLimitDetail.ttl} seconds.`;
      },
    };
  }
}
