const fetch = require('node-fetch');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../src/server');

describe('GET /proxy', () => {
    afterAll(done => {
        server.close(done);
    });
    
    it('should proxy a valid URL', async () => {
        const validUrl = 'https://example.com/image.jpg';

        const response = await request(server)
            .get('/proxy')
            .query({ url: validUrl });

        expect(response.status).toBe(200);
        expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should handle errors when fetching an invalid URL', async () => {
        const invalidUrl = 'invalid-url';

        const response = await request(server)
            .get('/proxy')
            .query({ url: invalidUrl });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error fetching resource');
    });

    it('should handle network errors during fetch', async () => {
        const url = 'https://unreachable-url';

        jest.spyOn(fetch, 'Promise').mockRejectedValue(new Error('Network error'));

        const response = await request(server)
            .get('/proxy')
            .query({ url });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error fetching resource');

        fetch.Promise.mockRestore();
    });
});
