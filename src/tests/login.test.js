const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../server');

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
