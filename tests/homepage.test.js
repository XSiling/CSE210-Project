const request = require('supertest');
const bcrypt = require('bcrypt');
const { app,users, server } = require('../src/server');

describe('Homepage functionalities', () => {
    beforeAll(async () => {
        // Setup step: Add 'testuser' to the users array
        const testUser = {
            username: 'testuser',
            hashedPassword: await bcrypt.hash('testpassword', 10),
            interests: [],
            mastodonAccount: '',
            profile_img: ''
        };
        users.push(testUser); 
    });

    afterAll(done => {
        // Teardown step: Remove 'testuser' from the users array
        const index = users.findIndex(user => user.username === 'testuser');
        if (index > -1) {
            users.splice(index, 1);
        }
        server.close(done);
    });

    // Test fetching recommendations
    describe('GET /recommendations/:username', () => {
        it('should fetch recommendations for a valid user', async () => {
            const response = await request(server).get('/recommendations/testuser');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.recommendations)).toBe(true);
        });

        it('should return error for an invalid user', async () => {
            const response = await request(server).get('/recommendations/invaliduser');
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // Test editing profile
    describe('POST /interests', () => {
        it('should successfully update user interests', async () => {
            const response = await request(server)
                .post('/interests')
                .send({ username: 'testuser', interests: ['Tech', 'Music'], mastodonAccount: 'mastodon@example.com', profile_img: 'img_url' });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return error for non-existent user', async () => {
            const response = await request(server)
                .post('/interests')
                .send({ username: 'nonexistentuser', interests: ['Tech', 'Music'] });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    // Test logout functionality
    describe('POST /logout', () => {
        it('should successfully log out a user', async () => {
            const response = await request(server).post('/logout');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    // Test Mastodon account validation (assuming you have such an endpoint)
    // describe('GET /validate-mastodon/:account', () => {
    //     it('should successfully validate a Mastodon account', async () => {
    //         // Replace with actual endpoint and logic
    //         const response = await request(server).get('/validate-mastodon/validaccount');
    //         expect(response.status).toBe(200);
    //         expect(response.body.isValid).toBe(true);
    //     });

    //     it('should return error for an invalid Mastodon account', async () => {
    //         // Replace with actual endpoint and logic
    //         const response = await request(server).get('/validate-mastodon/invalidaccount');
    //         expect(response.status).toBe(404);
    //         expect(response.body.isValid).toBe(false);
    //     });
    // });
});
