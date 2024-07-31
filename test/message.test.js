import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MONGO_URL } from "../src/util.js";
import Message from "../src/dao/models/message.model.js";

const requester = supertest("http://localhost:8080");

describe("Testeo de mensajes dao", function() {
    let user;
    let userId;
    let userRole;
    let userEmail;
    let authToken;
    let messageMock;

    const userCredentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    before(async function () {
        await mongoose.connect(MONGO_URL);
    });

    beforeEach(async function () {
        const loginResponse = await requester
            .post("/api/sessions/login")
            .send(userCredentials);

        expect(loginResponse.statusCode).to.equal(200);
        user = loginResponse.body;
        userId = loginResponse.body.userId;
        userRole = loginResponse.body.role;
        authToken = loginResponse.body.access_token;
        userEmail = loginResponse.body.message.email;
        console.log("Login exitoso:", loginResponse.body);
        console.log("UserId: ", userId);

        messageMock = {
            userEmail: userEmail,
            text: "Hola esto es un test de mensaje",
        }
    });

    describe("Prueba de agregado de mensaje en el chat", () => {
        it("El endpoint /api/messages/addMessage debera de agregar el mensaje en el chat", async function () {
            try {
                const addMessage = await requester
                    .post("/api/messages/addMessage")
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(messageMock);

                expect(addMessage.statusCode).to.equal(200);
                console.log("Mensaje agregado:", addMessage.body);
            } catch (error) {
                console.log("Error al agregar el mensaje al chat", error.response ? error.response.body : error);
                throw error;
            }
        });
    });

    describe("Prueba de vista de los mensajes", () => {
        it("El endpoint /api/messages/ debera de devolver una vista con todos los mensajes", async function () {
            try {
                const getMessages = await requester
                    .get("/api/messages/")
                    .set('Authorization', `Bearer ${authToken}`)
                
                expect(getMessages.statusCode).to.equal(200);
                console.log("Lista de mensajes:", getMessages.text);
            } catch (error) {
                console.log("Error al ver el chat", error.response ? error.response.body : error);
                throw error;
            }
        })    
    })

    after(async function() {
        // Se desconecta de la base de datos
        await Message.deleteMany({ userEmail: userEmail });

        await mongoose.disconnect();
    });
});