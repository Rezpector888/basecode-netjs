import { DatabaseConfig } from '@environment';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma-generated/prisma-app/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { config } from 'mssql';

@Injectable()
export class PrismaAppService extends PrismaClient {
  private logger: Logger = new Logger(PrismaAppService.name);
  constructor(databaseConfig: DatabaseConfig) {
    const sqlConfig: config = {
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.name,
      server: databaseConfig.host,
      port: databaseConfig.port,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true,
        trustServerCertificate: databaseConfig.trustServerCertificate,
      },
    };
    const adapter = new PrismaMssql(sqlConfig, {
      schema: databaseConfig.schema,
      onConnectionError: (err) => {
        this.logger.error('Database not connected');
        this.logger.error(err);
        throw new InternalServerErrorException()
      },
    });
    super({ adapter });
  }
}
