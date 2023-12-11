const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../src/server');

describe('POST /register', () => {
    afterAll(done => {
        server.close(done);
    });

    it('should register a new user', async () => {
        const username = 'testuser';
        const password = 'testpassword';
        const confirmPassword = 'testpassword';

        const response = await request(server)
            .post('/register')
            .send({ username, password, confirmPassword });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Registration successful');

        // Verify that the user is added to the users array
        expect(users.some(u => u.username === username)).toBe(true);
    });

    it('should handle duplicate usernames', async () => {
        const existingUser = { username: 'existinguser', hashedPassword: 'hashedpass', interests: [], following: [] };
        users.push(existingUser);

        const response = await request(server)
            .post('/register')
            .send({ username: 'existinguser', password: 'somepassword', confirmPassword: 'somepassword' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Username already exists');

        // Verify that the users array is unchanged
        expect(users).toContainEqual(existingUser);
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
            .send({ username: 'testuseBob', password: 'password', confirmPassword: 'differentPassword' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Passwords do not match');
    });
});
