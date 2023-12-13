const request = require('supertest');
const bcrypt = require('bcrypt');
const { app, users, server } = require('../src/server');
const { JSDOM } = require('jsdom');
const { loadStepInterests, loadStepProfileImg, loadStepMastodonAccount } = require('../src/components/interests.js');

let document;

const mockGetElementById = jest.fn();
document.getElementById = mockGetElementById;

document.createElement = jest.fn().mockImplementation((tag)=>{
    return {setAttribute: jest.fn(), innerHTML: ''};
})

/**
 * The test for update interests for backend.
 */
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


/**
 * The test for frontend different steps changing for user configuration after registers.
 */
describe('Configuration Step Change', ()=>{
    beforeAll(()=>{
        JSDOM.fromFile("../src/view/interests.html").then((dom)=>{
            document = dom.window.document;
        })
    });

    it("Load Interests", ()=>{
        loadStepInterests();
        expect(document.mockGetElementById("form-interests").style.display).toBe("block");
        expect(document.mockGetElementById("form-profile-img").style.display).toBe("none");
        expect(document.mockGetElementById("form-account").style.display).toBe("none");
    });

    it("Load Profile Img", ()=>{
        loadStepProfileImg();
        expect(document.mockGetElementById("form-interests").style.display).toBe("none");
        expect(document.mockGetElementById("form-profile-img").style.display).toBe("block");
        expect(document.mockGetElementById("form-account").style.display).toBe("none");
    });

    if("Load Account", ()=>{
        loadStepMastodonAccount();
        expect(document.mockGetElementById("form-interests").style.display).toBe("none");
        expect(document.mockGetElementById("form-profile-img").style.display).toBe("none");
        expect(document.mockGetElementById("form-account").style.display).toBe("block");
    });
});