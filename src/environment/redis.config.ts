import { Configuration, Value } from '@itgorillaz/configify';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class RedisConfig {
  @Value('REDIS_HOST')
  @IsNotEmpty()
  @IsString()
  host!: string;

  @Value('REDIS_PORT', {
    parse: (value: any) => parseInt(value),
  })
  @IsNotEmpty()
  @IsInt()
  port!: number;

  @Value('REDIS_PASSWORD')
  @IsNotEmpty()
  @IsString()
  password!: string;

  @Value('REDIS_PREFIX')
  @IsNotEmpty()
  @IsString()
  prefix!: string;
}
