/*
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
        // Conectarse a la base de datos
        await mongoose.connect(MONGO_URL);
    });

    beforeEach(async function () {
        // Ver si el usuario ya existe
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

            // Guardar el userId y la autenticacion del usuario
            authToken = loginResponse.body.access_token;
            userId = existingUser._id.toString();
        } else {
            // Registrar usuario
            const registerResponse = await requester.post("/api/sessions/register").send(userMock);
            expect(registerResponse.statusCode).to.equal(200);
            console.log("Registro exisoso:", registerResponse.body);

            userId = registerResponse.body.message._id;
            authToken = registerResponse.body.access_token;
        }
    });

    describe("Actualizar usuario test", () => {
        it("Deberia actualizar el usuario", async function () {
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
        // Limpieza
        await User.deleteMany({ first_name: "New test" });
        await mongoose.disconnect();
    });
});
*/