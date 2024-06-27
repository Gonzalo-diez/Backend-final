/*
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MONGO_URL } from "../src/util.js";

const requester = supertest("http://localhost:8080");

describe("Cart Tests", function () {
    const newProductId = "66442a7dac6f88bc4828611b";
    let cartId;
    let userId;
    let userRole;
    let authToken;
    let cartMock;
    let updateProductQuantity;

    const userCredentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    before(async function () {
        // Connect to the database
        await mongoose.connect(MONGO_URL);

        // User login
        const loginResponse = await requester
            .post("/api/sessions/login")
            .send(userCredentials);

        expect(loginResponse.statusCode).to.equal(200);
        authToken = loginResponse.body.access_token;
        userId = loginResponse.body.userId;
        userRole = loginResponse.body.userRole;
        console.log("Login exitoso:", loginResponse.body);

        // Initialize cartMock and updateProductQuantity after login
        cartMock = {
            productId: "667ccbaeb05b03f8181be1c3",
            userId: userId,
            userRole: userRole,
        };

        updateProductQuantity = {
            quantity: 3,
            userId: userId,
        };
    });

    describe("Agregado de producto al carrito", () => {
        it("En el endpoint /api/carts/ deberá agregar el producto del cartMock al carrito y guardar el cartId", async function () {
            try {
                const addProductToCartResponse = await requester
                    .post("/api/carts")
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(cartMock);

                expect(addProductToCartResponse.statusCode).to.equal(200);
                console.log("Producto en carrito:", addProductToCartResponse.body);
                cartId = addProductToCartResponse.body.cartItemId;
            } catch (error) {
                console.error("Error al agregar el producto al carrito:", error);
                throw error;
            }
        });
    });

    describe("Actualización del carrito", () => {
        it("En el endpoint /api/carts/:cid/products/:pid deberá actualizar la cantidad del producto en el carrito con el updateProductQuantity", async function () {
            try {
                const updateProductInCartResponse = await requester
                    .put(`/api/carts/${cartId}/products/${cartMock.productId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateProductQuantity);

                expect(updateProductInCartResponse.statusCode).to.equal(200);
                console.log("Cantidad del producto actualizado:", updateProductInCartResponse.body.cart.products);
            } catch (error) {
                console.error("Error al actualizar el producto del carrito:", error);
                throw error;
            }
        });
    });

    describe("Limpieza del carrito", () => {
        it("En el endpoint /api/carts/:cid deberá limpiar el carrito por completo", async function () {
            try {
                const clearCartResponse = await requester
                    .delete(`/api/carts/${cartId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(clearCartResponse.statusCode).to.equal(200);
                console.log("Carrito vaciado");
            } catch (error) {
                console.error("Error al limpiar el carrito:", error);
                throw error;
            }
        })
    })

    after(async function () {
        await mongoose.disconnect();
    });
});
*/