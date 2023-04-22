const request = require('supertest');
const app = require('../server/server');

describe('POST /inputMsg', () => {
  test('returns a successful response when parcel is provided', async () => {
    const parcel = 'test parcel';
    const response = await request(app)
      .post('/inputMsg')
      .send({ parcel });

    expect(response.status).toBe(200);
    expect(response.body.prompt).toBe(parcel);
    expect(response.body.status).toBe('recieved');
    expect(response.body.message).toBeDefined();
    expect(response.body.total_tokens).toBeDefined();
  });

  test('returns an error response when parcel is not provided', async () => {
    const response = await request(app)
      .post('/inputMsg')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('failed');
  });
});
