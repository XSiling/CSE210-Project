const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, server, db } = require('../src/server');

describe('POST /register', () => {
  beforeAll(async () => {
    // Connect to the MongoDB test database
    await db;
  });

  afterAll(async () => {
    await db.dropDatabase();
    await db.close();
    server.close();
  });

  it('should register a new user', async () => {
    const username = 'testuserD';
    const password = 'testpasswordD';
    const confirmPassword = 'testpasswordD';

    const response = await request(server)
      .post('/register')
      .send({ username, password, confirmPassword });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Registration successful');
  });

  it('should handle duplicate usernames', async () => {
    const existingUser = { username: 'existinguser', hashedPassword: 'hashedpass', interests: [] };
    await db.collection('users').insertOne(existingUser);

    const response = await request(server)
      .post('/register')
      .send({ username: 'existinguser', password: 'somepassword', confirmPassword: 'somepassword' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Username already exists');
  });

  it('should handle missing username or password', async () => {
    const response = await request(server)
      .post('/register')
      .send({}); // Sending an empty request

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Username and password are required');
  });

  it('should handle password mismatch', async () => {
    const response = await request(server)
      .post('/register')
      .send({ username: 'testuser', password: 'password', confirmPassword: 'differentPassword' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Passwords do not match');
  });
});