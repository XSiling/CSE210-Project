const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, server, db } = require('../src/server');
const mongoose = require('mongoose');

// Define a test user for login tests
const testUser = {
  username: 'testuser',
  hashedPassword: bcrypt.hashSync('testpassword', 10),
};

describe('POST /login', () => {
    beforeAll(async () => {
      // Create the test user in the database
      await db.collection('users').insertOne(testUser);
    });
  
    afterAll(async () => {
      await db.dropDatabase();
      await db.close();
      server.close();
    });

  it('should login a user with correct credentials', async () => {
    const response = await request(server)
      .post('/login')
      .send({ username: testUser.username, password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
  });

  it('should handle login with incorrect password', async () => {
    const response = await request(server)
      .post('/login')
      .send({ username: testUser.username, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should handle login with non-existent username', async () => {
    const response = await request(server)
      .post('/login')
      .send({ username: 'nonexistentuser', password: 'somepassword' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should handle missing username or password', async () => {
    const response = await request(server)
      .post('/login')
      .send({}); // Sending an empty request

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should handle bcrypt.compare() throwing an error', async () => {
    // Mock bcrypt.compare to throw an error
    jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('bcrypt error'));

    const response = await request(server)
      .post('/login')
      .send({ username: testUser.username, password: 'testpassword' });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal Server Error');

    // Restore the original implementation after the test
    bcrypt.compare.mockRestore();
  });
});
