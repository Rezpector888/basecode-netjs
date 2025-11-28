import { Configuration, Value } from '@itgorillaz/configify';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class DatabaseConfig {
  @Value('DATABASE_HOST')
  @IsString()
  @IsNotEmpty()
  host!: string;

  @Value('DATABASE_USER')
  @IsString()
  @IsNotEmpty()
  user!: string;

  @Value('DATABASE_PORT', {
    parse: (value: any) => parseInt(value),
  })
  @IsInt()
  port!: number;

  @Value('DATABASE_PASSWORD')
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Value('DATABASE_NAME')
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Value('DATABASE_URL')
  @IsString()
  @IsNotEmpty()
  url!: string;

  @Value('DATABASE_SCHEMA')
  @IsString()
  @IsNotEmpty()
  schema!: string;

  @Value('DATABASE_TRUST_SERVER_CERTIFICATE', { parse: (value: any) => value === 'true' })
  @IsIn([true, false])
  trustServerCertificate!: boolean;
}
