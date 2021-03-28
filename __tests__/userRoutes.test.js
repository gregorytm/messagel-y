const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config")


describe("User Routes Test", function() {

    let testerToken;

    beforeEach(async function() {
        await db.query("DELETE FROM messages");
        await db.query("DELETE FROM users");
        
        let u1 = await User.register({
            username: "test1",
            password: "password",
            first_name: "Test1",
            last_name: "Testy1",
            phone: "+14155550000",
        })
        testerToken = jwt.sign({ username:"test1" }, SECRET_KEY)
    })

        test("can get a list of users", async function(){
            let response = await request(app)
            .get("/users")
            .send({ _token:testerToken });

            expect(response.body).toEqual({
                users: [
                    {username: "test1",
                    first_name: "Test1",
                    last_name: "Testy1",
                    phone: "+14155550000"}
                ]
            })
        })

        //GET
        describe("GET route /users/:username", function() {
            test ("can get user data from username", async function() {
                let response = await request(app)
                .get("/users")
                .send({ _token:testerToken });

                expect (response.body).toEqual({
                    users:
                    {username: "test1",
                    first_name: "Test1",
                    last_name: "Testy1",
                    phone: "+14155550000",
                join_at: expect.any(String),
            last_login_at: expect.any(String)}
    })
    })
})
})
    

    afterAll(async function() {
        await db.end();
    })
