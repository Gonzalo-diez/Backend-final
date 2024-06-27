import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import Cart from "../src/dao/models/user.model.js";
import { MONGO_URL } from "../src/util.js";

const requester = supertest("http://localhost:8080");

describe("Cart Tests", function () {
    const newProductId = "66442a7dac6f88bc4828611b";
    let userId;
    let userRole;
    let authToken;

    const userCredentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    before(async function () {
        // Conectarse a la base de datos
        await mongoose.connect(MONGO_URL);

        // Login de usuario
        const loginResponse = await requester
            .post("/api/sessions/login")
            .send(userCredentials);
            
        expect(loginResponse.statusCode).to.equal(200);
        authToken = loginResponse.body.access_token;
        userId = loginResponse.body.userId;
        userRole = loginResponse.body.userRole;
        console.log("Login exitoso:", loginResponse._body);
    });

    describe("Agregado de producto al carrito", () => {
        it("En el endpoint /api/carts/ debera de agregar el producto del cartMock al carrito", async function () {
            try {
                console.log("Id del usuario:", userId);
                console.log("Rol del usuario:", userRole);

                const addProductToCartResponse = await requester
                    .post("/api/carts")
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        productId: "66442a77ac6f88bc482860f4",
                        userId: userId,
                        userRole: userRole,
                    });

                expect(addProductToCartResponse.statusCode).to.equal(200);
                console.log("Producto en carrito:", addProductToCartResponse.body);
            } catch (error) {
                console.error("Error al agregar el producto al carrito:", error);
                throw error;
            }
        });
    });

    after(async function () {
        await mongoose.disconnect();
    });
});