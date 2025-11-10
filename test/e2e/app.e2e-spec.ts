import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { API_KEY_HEADER } from '../../src/const/api-key-header';
import { ApiKeyGuard } from '../../src/guards/api-key.guard';

describe('GeoAPI E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalGuards(new ApiKeyGuard());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/countries (unauthorized)', () => {
    return request(app.getHttpServer())
      .get('/api/countries')
      .expect(401);
  });

  it('GET /api/countries (authorized)', () => {
    return request(app.getHttpServer())
      .get('/api/countries')
      .set(API_KEY_HEADER, process.env.API_KEY || 'test-api-key')
      .expect(200);
  });
});
