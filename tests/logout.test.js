const fetch = require('node-fetch');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../src/server');

describe('GET /check-login', () => {
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

    it('should return logged in status and redirect URL if active_user is set', async () => {
        const activeUser = 'testuser';

        const response = await request(server)
            .get('/check-login');

        expect(response.status).toBe(200);
        expect(response.body.loggedIn).toBe(true);
        expect(response.body.redirectUrl).toBe('recommendations.html?username=' + activeUser);
    });

    it('should successfully log out the user', async () => {
        const response = await request(server)
            .post('/logout');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Logged out successfully');
    });

    it('should return logged out status if active_user is not set', async () => {
        const response = await request(server)
            .get('/check-login');

        expect(response.status).toBe(200);
        expect(response.body.loggedIn).toBe(false);
        expect(response.body.redirectUrl).toBe('login.html');
    });
});

describe('POST /logout', () => {
    it('should successfully log out the user', async () => {
        const response = await request(server)
            .post('/logout');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Logged out successfully');
    });
});

describe('GET /users', () => {
    it('should return a list of users with sanitized data', async () => {
        const response = await request(server)
            .get('/users');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.users).toBeDefined();
    });
});