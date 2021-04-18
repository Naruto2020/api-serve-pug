// load up superTest, path, app and JSON modules 
const request = require("supertest");
const path = require('path');
const app = require('../app');
const Users = path.join(__dirname, '/users.json');


const newUser ={
    nom : "papy",
    email : "papy@test.com",
    password:'papy2021'
}

// cancel user account test before create another one 
beforeEach( ()=>{
    const userNom = newUser.nom;
    delete Users[userNom];

    const userName = "papy";
    delete Users[userName];
});

// test singUp user
describe("Post/user", ()=>{
    
    it("should sign up a user", async ()=>{
        await request(app)
        .post('/create')
        .send({
            nom : "jordan",
            email : "jordan@test.com",
            password:'jordan2021'
        })
        .expect(200)
    });
});

// test singIn user
describe("Post login user", ()=>{

    it('should sing in user', async ()=>{
        const response = await request(app)
          .post('/login')
          .send({
              email: newUser.email,
              password:newUser.password
          })
          .expect(200)
          expect(response.get(`Set-Cookie`)).toBeDefined();
          console.log("connect with username --> ",newUser.nom);

    });
});
