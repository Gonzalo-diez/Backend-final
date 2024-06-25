import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import User from "../src/dao/models/user.model.js";
import { MONGO_URL } from "../src/util.js";

const requester = supertest("http://localhost:8080");

describe("User Tests", function () {
    let userId;
    let authToken;

    const userMock = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        age: 30,
        password: 'password123',
        role: 'premium'
    };

    const updateUser = {
        first_name: "New test",
        last_name: "New user",
        email: "newtest@example.com"
    };

    before(async function () {
        // Connect to the database
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    beforeEach(async function () {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userMock.email });

        if (existingUser) {
            console.log("Usuario ya existe, procediendo con el login.");

            // Login
            const loginResponse = await requester.post("/api/sessions/login").send({
                email: userMock.email,
                password: userMock.password
            });

            expect(loginResponse.statusCode).to.equal(200);
            console.log("Login exitoso:", loginResponse.body);

            // Save authentication token for further tests
            authToken = loginResponse.body.access_token;
            userId = existingUser._id.toString();
        } else {
            // Register user
            const registerResponse = await requester.post("/api/sessions/register").send(userMock);
            expect(registerResponse.statusCode).to.equal(200);
            console.log("Registro exisoso:", registerResponse.body);

            userId = registerResponse.body.message._id;
            authToken = registerResponse.body.access_token;
        }
    });

    describe("User Update Test", () => {
        it("should update user details", async function () {
            const updatedUser = await requester
                .put(`/api/sessions/updateUser/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateUser);

            expect(updatedUser.statusCode).to.equal(200);
            expect(updatedUser.ok).to.be.true;
            expect(updatedUser.body).to.be.an('object');
            expect(updatedUser.body).to.have.property('_id', userId.toString());
            expect(updatedUser.body).to.have.property('first_name', updateUser.first_name);
            expect(updatedUser.body).to.have.property('last_name', updateUser.last_name);
            expect(updatedUser.body).to.have.property('email', updateUser.email);
            console.log("Usuario actualizado:", updatedUser._body)
        });
    });

    after(async function () {
        // Clean up if necessary
        await User.deleteMany({ first_name: "New test" });
        await mongoose.disconnect();
    });
});