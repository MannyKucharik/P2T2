import request from 'supertest';
import app from '../server.js'; 

describe('Initial Jest Setup Test', () => {
  it('should run a test successfully', () => {
    expect(1 + 1).toBe(2);
  });

  // This test will check if your API is actually reachable
  it('should respond to the login route', async () => {
    const res = await request(app).post('/api/login').send({
      email: "test@example.com",
      password: "wrongpassword"
    });
    // We expect a 400 because this user shouldn't exist
    expect(res.statusCode).toBe(400);
  });
});