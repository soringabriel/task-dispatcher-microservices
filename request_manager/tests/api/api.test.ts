import request from 'supertest';
import { app } from '../../src/apiServer';

jest.mock('../../src/kafkaClient', () => ({
    sendJobToKafka: jest.fn().mockResolvedValue(undefined)
}));

describe('POST /job', () => {
  it('should accept a valid job', async () => {
    const res = await request(app)
      .post('/job')
      .send({ job: 'test-task', time: 500 });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.job).toHaveProperty('id');
  });

  it('should reject missing job field', async () => {
    const res = await request(app)
      .post('/job')
      .send({ time: 500 });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});

describe('GET /job/:id', () => {
  it('should return 404 for unknown job_id', async () => {
    const res = await request(app).get('/job/nonexistent-id');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
