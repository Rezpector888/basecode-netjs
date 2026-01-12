import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bull';
import { BullService, ThrottlerConfigService } from '@lib/services';
import { RosteringModule } from '@modules/rostering';
import { PrismaModule } from '@lib/prisma';
import { AppConfig, EnvironmentModule, RedisConfig, ThrottlerConfig } from '@environment';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SanitizeInputMiddleware } from '@lib/middlewares';

@Module({
  imports: [
    PrismaModule,
    EnvironmentModule,
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
    ThrottlerModule.forRootAsync({
      inject: [ThrottlerConfig],
      useClass: ThrottlerConfigService,
    }),
    RosteringModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeInputMiddleware).forRoutes('{*sanitize}');
  }
}
