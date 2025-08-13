import request from 'supertest';
import express from 'express';
import { healthRouter } from '../src/routes/health';

const app = express();
app.use('/api/health', healthRouter);

describe('Health Endpoint', () => {
  test('GET /api/health should return status OK', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
    
    expect(typeof response.body.timestamp).toBe('string');
    expect(typeof response.body.uptime).toBe('number');
    expect(typeof response.body.environment).toBe('string');
  });

  test('Health endpoint should return valid timestamp format', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });
});