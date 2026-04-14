import { jest, describe, it, expect, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';
import User from '../models/user.js';
import Pet from '../models/pets.js';

(User.findOne as any) = jest.fn();
(User.prototype.save as any) = jest.fn();
(Pet.prototype.save as any) = jest.fn();
(Pet.find as any) = jest.fn();
(Pet.findByIdAndUpdate as any) = jest.fn();
(Pet.findByIdAndDelete as any) = jest.fn();

jest.mock('../utils/mailer.js', () => ({
  sendVerificationEmail: jest.fn().mockImplementation(() => Promise.resolve(true))
}));

describe('VetNotes API Endpoints', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/login should return 200 on valid credentials', async () => {
    (User.findOne as any).mockImplementation(() => Promise.resolve({
      _id: '123',
      email: 'test@ucf.edu',
      password: 'password123',
      firstName: 'Manny'
    }));

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@ucf.edu', password: 'password123' });

    expect(res.statusCode).toBe(200);
  });

  it('POST /api/register should return 201', async () => {
    (User.prototype.save as any).mockImplementation(() => Promise.resolve(true));

    const res = await request(app)
      .post('/api/register')
      .send({ firstName: 'Manny', lastName: 'K', email: 'test@ucf.edu', password: 'password123' });

    expect(res.statusCode).toBe(201);
  });

  it('POST /api/verify should verify user with correct code', async () => {
    (User.findOne as any).mockImplementation(() => Promise.resolve({
      email: 'test@ucf.edu',
      VerificationCode: '123456',
      save: jest.fn().mockImplementation(() => Promise.resolve(true))
    }));

    const res = await request(app)
      .post('/api/verify')
      .send({ email: 'test@ucf.edu', code: '123456' });

    expect(res.statusCode).toBe(200);
  });

  it('POST /api/forgot-password should return 200 for valid user', async () => {
    (User.findOne as any).mockImplementation(() => Promise.resolve({ 
        email: 'test@ucf.edu', 
        save: jest.fn().mockImplementation(() => Promise.resolve(true)) 
    }));

    const res = await request(app)
      .post('/api/forgot-password')
      .send({ email: 'test@ucf.edu' });

    expect(res.statusCode).toBe(200);
  });

  it('POST /api/pets should create a pet', async () => {
    (Pet.prototype.save as any).mockImplementation(() => Promise.resolve({ name: 'Buddy' }));

    const res = await request(app)
      .post('/api/pets')
      .send({ userId: '123', name: 'Buddy', species: 'Dog' });

    expect(res.statusCode).toBe(201);
  });

  it('GET /api/pets/:userId should return list of pets', async () => {
    (Pet.find as any).mockImplementation(() => Promise.resolve([{ name: 'Buddy' }]));

    const res = await request(app).get('/api/pets/123');

    expect(res.statusCode).toBe(200);
  });

  it('PATCH /api/pets/:id should update pet details', async () => {
    (Pet.findByIdAndUpdate as any).mockImplementation(() => Promise.resolve({ name: 'Buddy', notes: 'Updated' }));

    const res = await request(app)
      .patch('/api/pets/pet123')
      .send({ notes: 'Updated' });

    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/pets/:id should remove pet', async () => {
    (Pet.findByIdAndDelete as any).mockImplementation(() => Promise.resolve({ _id: 'pet123' }));

    const res = await request(app).delete('/api/pets/pet123');

    expect(res.statusCode).toBe(200);
  });
});