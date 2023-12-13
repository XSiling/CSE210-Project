const request = require('supertest');
const bcrypt = require('bcrypt');
const { app,users, server } = require('../src/server');
const { getCredential } = require('../src/components/recommendation');

// Mock global fetch
global.fetch = jest.fn();

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

}); 

// Helper function to reset mocks
function resetMocks() {
  fetch.mockClear();
  fetch.mockReset();
}

// // Mocking relevant DOM elements
// function setupDOMMocks() {
//   document.getElementById = jest.fn().mockImplementation((id) => {
//     switch (id) {
//       case 'get-credential-btn':
//         return {
//           innerHTML: '',
//           classList: { add: jest.fn(), remove: jest.fn() },
//           disabled: false
//         };
//       // Add more cases as needed
//       default:
//         return null;
//     }
//   });
// }

// describe('getCredential', () => {
//   beforeEach(() => {
//     resetMocks();
//     setupDOMMocks();
//   });

//   it('should validate Mastodon account successfully', async () => {
//     // Mocking fetch for users and Mastodon account validation
//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: () => Promise.resolve({
//         users: [{ username: 'testuser', mastodonAccount: 'validMastodonAccount' }]
//       })
//     }).mockResolvedValueOnce({
//       ok: true,
//       text: () => Promise.resolve('True')
//     });

//     // Call the function
//     await getCredential();

//     // Assertions
//     const btn = document.getElementById('get-credential-btn');
//     expect(btn.innerHTML).toContain('Linked');
//     expect(btn.disabled).toBeTruthy();
//   });

//   // Additional tests for different scenarios
// });

// ...existing imports and setups

// Mocking window.location.search
const mockLocationSearch = '?username=testuser';
Object.defineProperty(window, 'location', {
  value: {
    search: mockLocationSearch
  },
  writable: true
});

describe('getCredential', () => {
  beforeEach(() => {
    resetMocks();
    setupDOMMocks();
    // Reset window.location.search if needed
    window.location.search = mockLocationSearch;
  });

  // ...existing tests

  it('should handle Mastodon account not linked scenario', async () => {
    // Mock fetch for scenario where Mastodon account is not linked
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        users: [{ username: 'testuser', mastodonAccount: 'validMastodonAccount' }]
      })
    }).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('False') // Simulate account not linked
    });

    await getCredential();

    // Assertions for this scenario
    const btn = document.getElementById('get-credential-btn');
    expect(btn.innerHTML).toContain('Click here to link Mastodon');
    expect(btn.disabled).toBeFalsy();
  });
});
