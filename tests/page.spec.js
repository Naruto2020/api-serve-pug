// load up superTest, path, app and JSON modules 
const request = require("supertest");
const path = require('path');
const app = require('../app');
const Users = path.join(__dirname, '/users.json');

// test sing up page serve 
describe("GET/create", ()=>{

    it("should display sign up page", async ()=>{
        await request(app)
        .get('/create')
        .send({})
        .expect(200)
    });
});

// test sing in page serve 
describe("GET/connect", ()=>{

    it("should display sign up page", async ()=>{
        await request(app)
        .get('/connect')
        .send({})
        .expect(200)
    });
});
// test home page serve 
describe("GET/restricted", ()=>{

    it("should display sign up page", async ()=>{
        await request(app)
        .get('/restricted')
        .send({})
        .expect(200)
    });
});