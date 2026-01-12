import { PrismaAppService } from '@lib/prisma';
import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/api/app.module';
import request from 'supertest';
import { App } from 'supertest/types';
import { Prisma } from '@prisma-generated/prisma-app/client';

describe('SchedulesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

    await app.init();
  });

  // const schedules: Prisma.schedulesGetPayload<{}> | null = {
  //   id: "",
  //   member_id: "",
  //   start_date: "",
  //   end_date: "",
  //   created_at: "",
  //   updated_at: ""
  // }

  it('/v1/rostering/schedules (GET)', () => {
    return request(app.getHttpServer()).get('/v1/rostering/schedules').expect(200);
  });

  it('');
  afterAll(async () => {
    const prisma = app.get(PrismaAppService);
    await prisma.$disconnect();
    await app.close();
  });
});
