/**
 * Module for verifying API endpoints.
 * @module __tests__/routes
 * @author Petar Drumev
 * @see schemas/* for JSON Schema definitions
 */

const request = require('supertest');
const app = require('../index.js');
const users = require('../models/users');
const roles = require('../models/roles');
const applications = require('../models/applications');
const chats = require('../models/chats');

//Separate the test file into cases for each route (sep of concerns)
//SETUP NEW DATABASE UPON EVERY TEST / and maybe upon every server start?

//id of test objects created | to avoid getting the objects in every test the id is needed (less function calls)
let messageId, chatId, applicationId, roleId, userId, adminToken, userToken;

/**
 * Uses the POST login method and returns the JWT token assigned to the user.
 * @param {object} login - Object containing 2 attributes: username & password
 * @returns {string} The JWT token that was assigned to the user during the login operation
 */
const loginToken = async function (login) {
    let token;
    await request.agent(app)
        .post('/api/users/login')
        .send({ username: login.username, password: login.password })
        .expect((res) => {
            token = res.body.token;
            //console.log(res.body);
        });
    return token;
};

const adminLogin = { username: 'admin1', password: 'admin1' };
//const userLogin = { username: 'user1', password: 'user1' }; //might want to assign the userToken to the test1 user

/*
let server, agent;

beforeEach((done) => {
    server = app.listen(3000, (err) => {
        if (err) return done(err);

        agent = request.agent(server);
        done();
    });
});

afterEach(() => {
    return server && server.close();
});
*/

//or maybe after all cause idk if i have to reinitialize the app
//OR maybe pass in (import) the app agent (without listening to the port) and initialize it beforeAll or beforeEach?
afterEach(() => {
    return app.close();
});

describe('POST Endpoints', function () {
    it('create a user account', async function () {
        await request.agent(app)
            .post('/api/users/register')
            .send({ username: 'test1', password: 'test1', email: 'test1@gmail.com', firstName: 'test1', lastName: 'test1' })
            .expect(201)
            .expect((res) => {
                userToken = res.body.token;
            });
    });
    it('create a role', async function () {
        adminToken = await loginToken(adminLogin);
        await request.agent(app)
            .post('/api/roles')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ name: 'test1', description: 'created test role :)' })
            .expect(201)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('assign role to user', async function () {
        //get test user id
        const user = await users.findByUsername('test1');
        userId = user[0].ID;
        //get the test role id
        const role = await roles.getByName('test1');
        //console.log(role);
        roleId = role[0].ID;
        const routeStr = '/api/users/'.concat(userId.toString().concat('/roles'));
        await request.agent(app)
            .post(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ role_ID: roleId })
            .expect(201)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('create an application', async function () {
        await request.agent(app)
            .post('/api/applications')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ company_name: 'test1', address: 'test1', postcode: 'test1', telephone_number: 'test1', insurance_company: 'test1' })
            .expect(201)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('create a chat', async function () {
        await request.agent(app)
            .post('/api/chats')
            .set('Authorization', 'Bearer ' + userToken)
            .expect(201);
    });
    it('create a message', async function () {
        const chat = await chats.getChatByUserId(userId);
        chatId = chat[0].ID;
        const routeStr = '/api/chats/'.concat(chatId.toString());
        await request.agent(app)
            .post(routeStr)
            .set('Authorization', 'Bearer ' + userToken)
            .send({ message_content: 'Hello this is a test message' })
            .expect(201); //and expect {updated: true}
    });
});

describe('PUT Endpoints', function () {
    it('update a user account', async function () {
        //get token
        const routeStr = '/api/users/'.concat(userId.toString());
        await request.agent(app)
            .put(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ email: 'updated' })
            .expect(200); //and expect {updated: true}
    });
    it('update a role', async function () {
        const routeStr = '/api/roles/'.concat(roleId.toString());
        await request.agent(app)
            .put(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ description: 'created test role updated :)' })
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('update an application', async function () {
        const application = await applications.getByName('test1');
        applicationId = application[0].ID;
        const routeStr = '/api/applications/'.concat(applicationId.toString());
        await request.agent(app)
            .put(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ address: 'test1 but updated!' })
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
});

describe('GET Endpoints', function () {
    it('admin - get all users', async function () {
        await request.agent(app)
            .get('/api/users')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('user - get all users', async function () {
        //userToken = await loginToken(userLogin);
        await request.agent(app)
            .get('/api/users')
            .set('Authorization', 'Bearer ' + userToken)
            .expect(403)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('admin - get user profile (not own)', async function () {
        const user = await users.findByUsername('user1');
        const userID = user[0].ID;
        await request.agent(app)
            .get(`/api/users/${userID}`)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('user - get user profile (not own)', async function () {
        const user = await users.findByUsername('user1');
        const userID = user[0].ID;
        await request.agent(app)
            .get(`/api/users/${userID}`)
            .set('Authorization', 'Bearer ' + userToken)
            .expect(403)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('admin - get a users roles', async function () {
        const user = await users.findByUsername('user1');
        const userID = user[0].ID;
        await request.agent(app)
            .get(`/api/users/${userID}/roles`)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get all chats', async function () {
        await request.agent(app)
            .get('/api/chats')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get all chat messages', async function () {
        await request.agent(app)
            .get('/api/chats/1')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get all pending chats', async function () {
        await request.agent(app)
            .get('/api/chats/pending')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get all applications', async function () {
        await request.agent(app)
            .get('/api/applications')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get specific application', async function () {
        await request.agent(app)
            .get('/api/applications/1')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get all roles', async function () {
        await request.agent(app)
            .get('/api/roles')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('get role by id', async function () {
        await request.agent(app)
            .get('/api/roles/1')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
});

describe('DEL Endpoints', function () {
    it('remove a message', async function () {
        const message = await chats.getMessageByUserId(userId);
        messageId = message[0].ID;
        const routeStr = '/api/chats/removeMessage';
        await request.agent(app)
            .del(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ message_id: messageId })
            .expect(200); //and expect {updated: true}
    });
    it('remove a chat', async function () {
        const routeStr = '/api/chats/'.concat(chatId.toString());
        await request.agent(app)
            .del(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200); //and expect {updated: true}
    });
    it('remove an application', async function () {
        const routeStr = '/api/applications/'.concat(applicationId.toString());
        await request.agent(app)
            .del(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('remove role from user', async function () {
        const routeStr = '/api/users/'.concat(userId.toString().concat('/roles'));
        await request.agent(app)
            .del(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({ role_ID: roleId })
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
    it('remove a user account', async function () {
        //get test user id
        //const user = await users.findByUsername('test1');
        //const id = user[0].ID;
        //get token
        const routeStr = '/api/users/'.concat(userId.toString());
        await request.agent(app)
            .del(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200); //and expect {updated: true}
    });
    it('remove a role', async function () {
        const routeStr = '/api/roles/'.concat(roleId.toString());
        await request.agent(app)
            .del(routeStr)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .expect((res) => {
                //console.log(res.body);
            });
    });
});
