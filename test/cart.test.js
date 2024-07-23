/*
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MONGO_URL } from "../src/util.js";

const requester = supertest("http://localhost:8080");

describe("Cart Tests", function () {
    const newProductId = "66442a7dac6f88bc4828611b";
    let user;
    let userId;
    let userRole;
    let authToken;
    let cartMock;

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
        console.log("Login exitoso:", loginResponse.body);
        console.log("UserId: ", userId);

        cartMock = {
            productId: "667ccbaeb05b03f8181be1c3",
        };
    });

    describe("Prueba de agregar el producto al carrito del usuario", () => {
        it("El endpoint /api/carts/ debera de agregar el cartMock al carrito", async function () {
            try {
                const addProductToCart = await requester
                    .post("/api/carts/")
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(cartMock);

                console.log("Respuesta del servidor:", addProductToCart.body);
                expect(addProductToCart.statusCode).to.equal(200);

            } catch (error) {
                console.log("Error al agregar el producto al carrito", error.response ? error.response.body : error);
                throw error;
            }
        });
    });

    after(async function () {
        await mongoose.disconnect();
    });
});
*/