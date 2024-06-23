/*
import { expect } from "chai";
import supertest from "supertest";
import Assert from "assert";
import mongoose from "mongoose";
import User from "../src/dao/models/user.model.js";
import { MONGO_URL } from "../src/util.js";

const assert = Assert.strict;
const requester = supertest("http://localhost:8080");

describe("Test de user", function() {

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
    }

    before(async function() {
        // Conectar a la base de datos
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    beforeEach(async function() {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: userMock.email });

        if (existingUser) {
            console.log("Usuario ya existe, procediendo con el login.");

            // Iniciar sesión
            const loginResponse = await requester.post("/api/sessions/login").send({
                email: userMock.email,
                password: userMock.password
            });

            expect(loginResponse.statusCode).to.equal(200);

            // Guardar token de autenticación para usarlo en las pruebas
            authToken = loginResponse.body.access_token;
            userId = existingUser._id.toString();
        } else {
            // Registrar usuario
            const registerResponse = await requester.post("/api/sessions/register").send(userMock);
            expect(registerResponse.statusCode).to.equal(200);

            // Iniciar sesión
            const loginResponse = await requester.post("/api/sessions/login").send({
                email: userMock.email,
                password: userMock.password
            });

            expect(loginResponse.statusCode).to.equal(200);

            // Guardar token de autenticación para usarlo en las pruebas
            authToken = loginResponse.body.access_token; 
            userId = registerResponse.body.message._id;
        }
    });

    describe("Test login", () => {
        it("El endpoint /sessions/register debe de registrar el usuario", async function() {
            const {
                statusCode,
                ok,
                body
            } = await requester.post("/api/sessions/register").send(userMock);

            console.log(statusCode);
            console.log(ok);
            console.log(body);

            expect(statusCode).to.equal(200); 
            expect(ok).to.be.true;
        });

        it("El endpoint /api/sessions/login debe loguear el usuario", async function() {
            const loginDetails = {
                email: 'test@example.com',
                password: 'password123'
            };

            const {
                statusCode,
                ok,
                body
            } = await requester.post("/api/sessions/login").send(loginDetails);

            console.log(statusCode);
            console.log(ok);
            console.log(body);

            expect(statusCode).to.equal(200); 
            expect(ok).to.be.true;
        });
    });

    describe("Test de usuario", () => {
        it("El endpoint /api/sessions/updateUser/:uid debe actualizar un usuario específico", async function() {
            const { statusCode, ok, body } = await requester
            .put(`/api/sessions/updateUser/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateUser);

            console.log(statusCode);
            console.log(ok);
            console.log(body);

            expect(statusCode).to.equal(200); 
            expect(ok).to.be.true;
            expect(body).to.be.an('object');
            expect(body).to.have.property('_id', userId.toString());
        });
    });
    
    after(async function() {
        // Limpiar usuario si existe
        // await User.deleteMany({ first_name: updateUser.first_name });
        // await User.deleteMany({ first_name: userMock.first_name });
        // Desconectar mongoose
        await mongoose.disconnect();
    });
});
*/