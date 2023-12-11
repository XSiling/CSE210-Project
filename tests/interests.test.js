const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../src/server');

describe('POST /interests', () => {
    afterAll(done => {
        server.close(done);
    });

    beforeEach(() => {
        // Setup a mock users array before each test
        const existingUser = { username: 'existingUser', hashedPassword: bcrypt.hash('testpassword', 10), interests: ['Emotion', 'Fun'], following:[] };
        users.push(existingUser);
    });

    it('should update interests of an existing user', async () => {
        const response = await request(app)
            .post('/interests')
            .send({ username: 'existingUser', interests: ['Star', 'Fun'] });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(users.find(u => u.username === 'existingUser').interests).toEqual(['Star', 'Fun']);
    });

    it('should handle invalid request bodies', async () => {
        const response = await request(app)
            .post('/interests')
            .send({ user: 'invalidUser' }); // no interests sent

        expect(response.statusCode).toBe(404);
    });

    it('response structure is correct', async () => {
        const response = await request(app)
            .post('/interests')
            .send({ username: 'existingUser', interests: ['Emotion'] });

        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('message');
    });
});