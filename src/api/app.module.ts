import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bull';
import { BullService } from '@lib/services';
import { AppConfig, NestConfigModule, RedisConfig } from '@lib/config';
import { RosteringModule } from '@modules/rostering';
import { PrismaModule } from '@lib/prisma';

@Module({
  imports: [
    PrismaModule,
    NestConfigModule,
    LoggerModule.forRootAsync({
      inject: [AppConfig],
      useFactory: async (config: AppConfig) => {
        const env = process.env.NODE_ENV || 'development';
        const redactFields = [
          'req.headers.authorization',
          'req.body.password',
          'req.body.confirmPassword',
        ];
        const basePinoOptions = {
          translateTime: true,
          ignore: 'pid,hostname',
          singleLine: true,
          redact: redactFields,
        };
        return {
          pinoHttp: {
            timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
            name: config.name,
            customProps: () => ({
              context: 'HTTP',
            }),
            serializers: {
              req(request) {
                request.body = request.raw.body;
                return request;
              },
            },
            level: env.startsWith('prod') ? 'info' : 'debug',
            redact: {
              paths: redactFields,
              censor: '**GDPR COMPLIANT**',
            },
            transport: env.startsWith('prod')
              ? {
                  targets: [
                    {
                      target: 'pino-pretty',
                      level: 'info',
                      options: {
                        ...basePinoOptions,
                        colorize: true,
                      },
                    },
                    {
                      target: 'pino/file',
                      level: 'info',
                      options: {
                        ...basePinoOptions,
                        destination: 'logs/info.log',
                        mkdir: true,
                        sync: false,
                      },
                    },
                    {
                      target: 'pino/file',
                      level: 'error',
                      options: {
                        ...basePinoOptions,
                        destination: 'logs/error.log',
                        mkdir: true,
                        sync: false,
                      },
                    },
                  ],
                }
              : {
                  targets: [
                    {
                      target: 'pino-pretty',
                      level: 'debug',
                      options: {
                        ...basePinoOptions,
                        colorize: true,
                      },
                    },
                    {
                      target: 'pino/file',
                      level: 'info',
                      options: {
                        ...basePinoOptions,
                        destination: 'logs/info.log',
                        mkdir: true,
                        sync: false,
                      },
                    },
                    {
                      target: 'pino/file',
                      level: 'error',
                      options: {
                        ...basePinoOptions,
                        destination: 'logs/error.log',
                        mkdir: true,
                        sync: false,
                      },
                    },
                  ],
                },
          },
          exclude: [{ method: RequestMethod.ALL, path: 'docs' }],
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [RedisConfig, AppConfig],
      useClass: BullService,
    }),
    RosteringModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
