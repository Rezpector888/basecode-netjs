import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class ThrottlerConfig {
  @Value('THROTTLER_TTL')
  ttl: number = 60;

  @Value('THROTTLER_LIMIT')
  limit: number = 5;
}
