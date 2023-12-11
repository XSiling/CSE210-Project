// const request = require('supertest');
// const { app, users } = require('../src/server.js');

// describe('Express API Tests', () => {
//   beforeEach(() => {
//     users.length = 0;
//   });

//   it('should register a new user', async () => {
//     const response = await request(app)
//       .post('/register')
//       .send({ username: 'testuser', password: 'password', confirmPassword: 'password' });

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('Registration successful');
//     expect(response.body.userName).toBe('testuser');
//   });

//   it('should not register a user with missing data', async () => {
//     const response = await request(app)
//       .post('/register')
//       .send({ username: 'testuser' });

//     expect(response.status).toBe(400);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('Username and password are required');
//   });

//   it('should not register a user with mismatched passwords', async () => {
//     const response = await request(app)
//       .post('/register')
//       .send({ username: 'testuser', password: 'password', confirmPassword: 'differentpassword' });

//     expect(response.status).toBe(400);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('Passwords do not match');
//   });

//   it('should not register a user with an existing username', async () => {
//     users.push({ username: 'existinguser', hashedPassword: 'hashedpassword', interests: [], mastodonAccount: "", following: [] });

//     const response = await request(app)
//       .post('/register')
//       .send({ username: 'existinguser', password: 'password', confirmPassword: 'password' });

//     expect(response.status).toBe(400);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('Username already exists');
//   });

//   it('should log in a user with valid credentials', async () => {
//     users.push({ username: 'testuser', hashedPassword: 'hashedpassword', interests: [], mastodonAccount: "", following: [] });

//     const response = await request(app)
//       .post('/login')
//       .send({ username: 'testuser', password: 'password' });

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('Login successful');
//     expect(response.body.userName).toBe('testuser');
//   });

//   it('should not log in a user with invalid credentials', async () => {
//     const response = await request(app)
//       .post('/login')
//       .send({ username: 'nonexistentuser', password: 'invalidpassword' });

//     expect(response.status).toBe(401);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('Invalid credentials');
//   });

//   it('should check login status for a logged-in user', async () => {
//     users.push({ username: 'loggedinuser', hashedPassword: 'hashedpassword', interests: [], mastodonAccount: "", following: [] });

//     const response = await request(app)
//       .get('/check-login')
//       .set('Cookie', [`username=loggedinuser`]);

//     expect(response.status).toBe(200);
//     expect(response.body.loggedIn).toBe(true);
//     expect(response.body.redirectUrl).toContain('recommendations.html?username=loggedinuser');
//   });

//   it('should check login status for a non-logged-in user', async () => {
//     const response = await request(app).get('/check-login');

//     expect(response.status).toBe(200);
//     expect(response.body.loggedIn).toBe(false);
//     expect(response.body.redirectUrl).toBe('');
//   });

//   it('should log out a logged-in user', async () => {
//     users.push({ username: 'loggedoutuser', hashedPassword: 'hashedpassword', interests: [], mastodonAccount: "", following: [] });

//     const response = await request(app)
//       .post('/logout')
//       .set('Cookie', [`username=loggedoutuser`]);

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('Logged out successfully');
//   });

//   it('should update user interests', async () => {
//     users.push({ username: 'testuser', hashedPassword: 'hashedpassword', interests: [], mastodonAccount: "", following: [] });

//     const updatedInterests = ['Interest 1', 'Interest 2'];

//     const response = await request(app)
//       .post('/interests')
//       .send({ username: 'testuser', interests: updatedInterests });

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('Interests updated successfully');

//     const user = users.find((u) => u.username === 'testuser');
//     expect(user.interests).toEqual(updatedInterests);
//   });

//   it('should get recommendations for a user', async () => {
//     users.push({ username: 'testuser', hashedPassword: 'hashedpassword', interests: ['Interest 1', 'Interest 2'], mastodonAccount: "", following: [] });

//     const response = await request(app)
//       .get('/recommendations/testuser');

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.recommendations).toContain('User 3');
//     expect(response.body.recommendations).toContain('User 4');
//     expect(response.body.recommendations).toContain('Group B');
//   });

//   it('should get a list of all users', async () => {
//     users.push(
//       { username: 'user1', hashedPassword: 'hashedpassword1', interests: [], mastodonAccount: "", following: [] },
//       { username: 'user2', hashedPassword: 'hashedpassword2', interests: [], mastodonAccount: "", following: [] },
//       { username: 'user3', hashedPassword: 'hashedpassword3', interests: [], mastodonAccount: "", following: [] }
//     );

//     const response = await request(app)
//       .get('/users');

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.users).toHaveLength(3);
//   });

//   it('should follow a user', async () => {
//     users.push(
//       { username: 'follower', hashedPassword: 'hashedpassword1', interests: [], mastodonAccount: "", following: [] },
//       { username: 'userToFollow', hashedPassword: 'hashedpassword2', interests: [], mastodonAccount: "", following: [] }
//     );

//     const response = await request(app)
//       .post('/follow')
//       .send({ username: 'follower', following: 'userToFollow' });

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('Has updated the following');

//     const follower = users.find((u) => u.username === 'follower');
//     expect(follower.following).toContain('userToFollow');
//   });

//   it('should unfollow a user', async () => {
//     users.push(
//       { username: 'follower', hashedPassword: 'hashedpassword1', interests: [], mastodonAccount: "", following: ['userToUnfollow'] },
//       { username: 'userToUnfollow', hashedPassword: 'hashedpassword2', interests: [], mastodonAccount: "", following: [] }
//     );

//     const response = await request(app)
//       .post('/unfollow')
//       .send({ username: 'follower', following: 'userToUnfollow' });

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('Has updated the following');

//     const follower = users.find((u) => u.username === 'follower');
//     expect(follower.following).not.toContain('userToUnfollow');
//   });
// });
