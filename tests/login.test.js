const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../src/server');

describe('POST /login', () => {
    afterAll(done => {
        server.close(done);
    });

    it('should login a user with correct credentials', async () => {
        const existingUser = { username: 'testuser', hashedPassword: await bcrypt.hash('testpassword', 10) };
        users.push(existingUser);

        const response = await request(server)
            .post('/login')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login successful');
    });

    it('should handle login with incorrect password', async () => {
        const existingUser = { username: 'testuser', hashedPassword: await bcrypt.hash('testpassword', 10) };
        users.push(existingUser);

        const response = await request(server)
            .post('/login')
            .send({ username: 'testuser', password: 'wrongpassword' });

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
        const spy = jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('bcrypt error'));

        const response = await request(server)
            .post('/login')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Internal Server Error');

        spy.mockRestore(); // Restore the original implementation after the test
    });
});

describe('Session Handling', () => {
  let sessionCookie = null;

  beforeAll(async () => {
    // Register a new user
    await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password', confirmPassword: 'password' });
  });

  test('Successful session creation on login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBeTruthy();
    sessionCookie = response.headers['set-cookie'][0];
  });

  test('Access restricted endpoint with valid session', async () => {
    const response = await request(app)
      .get('/restricted-endpoint') // Replace with a real endpoint that requires authentication
      .set('Cookie', sessionCookie);

    expect(response.statusCode).toBe(200); // Or the expected success status code
  });

  test('Session termination on logout', async () => {
    const response = await request(app)
      .get('/logout')
      .set('Cookie', sessionCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBeTruthy();
  });

  test('Access restricted endpoint with terminated session', async () => {
    const response = await request(app)
      .get('/restricted-endpoint') // Replace with a real endpoint that requires authentication
      .set('Cookie', sessionCookie);

    expect(response.statusCode).toBe(401); // Or the expected failure status code for unauthenticated access
  });
});

