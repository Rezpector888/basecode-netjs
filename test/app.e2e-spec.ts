import { PrismaAppService } from '@lib/prisma';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/api/app.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      message: 'Welcome to the WCC API Service',
    });
  });
  afterAll(async () => {
    const prisma = app.get(PrismaAppService);
    await prisma.$disconnect();
    await app.close();
  });
});
