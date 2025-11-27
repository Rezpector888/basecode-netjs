import { Injectable } from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { DatabaseConfig } from 'src/api/lib/config';
// import { PrismaClient } from './generated/prisma/client';
import { PrismaClient } from 'src/prisma-generated/prisma-app/client';

@Injectable()
export class PrismaAppService extends PrismaClient {
  constructor(databaseConfig: DatabaseConfig) {
    const sqlConfig = {
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.name,
      server: databaseConfig.host,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: databaseConfig.trustServerCertificate, // change to true for local dev / self-signed certs
      },
    };
    const adapter = new PrismaMssql(sqlConfig, { schema: databaseConfig.schema });
    super({ adapter });
  }
}
