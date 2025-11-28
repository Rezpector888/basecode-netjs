import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';
import { BigIntInterceptor, ResponseTransformInterceptor } from 'src/api/lib/interceptors';
import { SwaggerSetup } from 'src/api/lib/services';
import { NotFoundExceptionFilter } from 'src/api/lib/exceptions';
import { AppConfig } from '@environment';
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

  const logger = new Logger('API Bootstrap');
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
  // app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
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
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${appConfig.appUrl}`);
}
bootstrap();
