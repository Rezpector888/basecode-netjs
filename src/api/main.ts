import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';
import { AppConfig } from '@environment';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { BigIntInterceptor, ResponseTransformInterceptor } from '@lib/interceptors';
import { NotFoundExceptionFilter } from '@lib/exceptions';
import { SwaggerSetup } from '@lib/services';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    autoFlushLogs: true,
    bodyParser: true,
    forceCloseConnections: true,
  });
  app.set('query parser', 'extended');
  app.useLogger(app.get(PinoLogger));
  const appConfig = app.get(AppConfig);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `${appConfig.gprcHost}:${appConfig.port}`,
      package: [],
      protoPath: [],
      gracefulShutdown: true,
      onLoadPackageDefinition: appConfig.env.startsWith('prod')
        ? undefined
        : (pkg, server) => {
            new ReflectionService(pkg, server);
          },
    },
  });
  const logger = new Logger(`${appConfig.name}`);
  app.use(
    compression({
      threshold: 512,
    }),
  );
  app.flushLogs();
  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address
  app.enable('trust proxy', true); // Trust proxy for all requests
  app.enableCors({
    credentials: true, // Allow credentials with CORS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    maxAge: 3600, // Max cache age for preflight requests
  });

  app.useBodyParser('text');

  app.use(
    helmet({
      hidePoweredBy: true, // Hide the "X-Powered-By" header
      contentSecurityPolicy: appConfig.env ? true : false, // Enable CSP only in production
      referrerPolicy: true, // Set Referrer-Policy header
      frameguard: true, // Prevent clickjacking attacks
      hsts: true, // HTTP Strict Transport Security
      noSniff: true, // Prevent sniffing of MIME types
    }),
  );
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(),
    new BigIntInterceptor(),
    new LoggerErrorInterceptor(),
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());

  process.on('SIGINT', async () => {
    const logger = new Logger('Graceful Shutdown');
    setTimeout(() => process.exit(1), 5000);
    logger.verbose(`Signal received with code SIGINT ⚡.`);
    logger.debug('❗Closing http server with grace.');
    app.close().then(() => {
      logger.debug('✅ Http server closed.');
      process.exit(0);
    });
  });

  process.on('SIGTERM', async () => {
    logger.verbose(`Signal received with code SIGTERM ⚡.`);
    logger.debug('❗Closing http server with grace.');
    app.close().then(() => {
      logger.debug('✅ Http server closed.');
      process.exit(0);
    });
  });

  if (appConfig.env != 'production') {
    SwaggerSetup(app, appConfig); // Setup Swagger for API documentation
  }

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${appConfig.appUrl}`);
  logger.log(`🚀 gPRC is running on: ${appConfig.gprcHost}:${appConfig.gprcPort}`);
}
bootstrap();
