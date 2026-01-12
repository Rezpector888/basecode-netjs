import { Configuration, Value } from '@itgorillaz/configify';
import { IsIn, IsInt, IsIP, IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class AppConfig {
  @Value('NODE_ENV')
  @IsString()
  @IsNotEmpty()
  @IsIn(['development', 'production', 'test', 'staging'])
  env!: string;

  @Value('TZ')
  @IsString()
  @IsNotEmpty()
  timezone!: string;

  @Value('APP_PORT', {
    parse: (value: any) => parseInt(value),
  })
  @IsInt()
  port!: number;

  @Value('APP_NAME')
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Value('APP_URL')
  @IsString()
  @IsNotEmpty()
  appUrl!: string;

  @Value('GPRC_HOST')
  @IsIP()
  @IsString()
  gprcHost!: string;

  @Value('GPRC_PORT', { parse: (val: any) => parseInt(val) })
  @IsInt()
  gprcPort!: number;
}
