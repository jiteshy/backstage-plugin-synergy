import express from 'express';
import request from 'supertest';
import { mockServices } from '@backstage/backend-test-utils';
import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const config = ConfigReader.fromConfigs([
      {
        context: 'synergy',
        data: {
          synergy: {
            provider: {
              type: 'github',
              github: {
                org: 'test',
                host: 'test',
                apiBaseUrl: 'test',
                token: 'test',
              },
            },
            repoTag: 'test',
          },
        },
      },
    ]);
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
