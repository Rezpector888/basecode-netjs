import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
    autoFlushLogs: true,
  });
  app.flushLogs();
  const logger = new Logger('Worker Bootstrap');
  logger.log(`==========================================================`);
  logger.log(`🚀 Worker is running`);
}
bootstrap();
