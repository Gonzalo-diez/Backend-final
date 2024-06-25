/*
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MONGO_URL } from "../src/util.js";

const requester = supertest("http://localhost:8080");

let authToken;
let userId;
let productId;
let cartId;

const userCredentials = {
    email: 'newtest@example.com',
    password: 'password123'
};

before(async function () {
    await mongoose.connect(MONGO_URL);

    const loginResponse = await requester.post("/api/sessions/login").send(userCredentials);
    expect(loginResponse.statusCode).to.equal(200);
    console.log("Login exitoso:", loginResponse.body);
    authToken = loginResponse.body.access_token;
    userId = loginResponse.body.message._id;
});

describe("Pruebas para CRUD del carrito", function () {
    it("Debería obtener la lista de productos y seleccionar uno aleatoriamente", async function () {
        try {
            const productsList = await requester.get("/api/products/");

            expect(productsList.statusCode).to.equal(200);
            console.log("Lista de los productos:", productsList.body);

            // Selecciona un producto aleatorio de la lista
            const randomProduct = productsList[Math.floor(Math.random() * productsList.length)];
            productId = randomProduct._id;

            console.log("Producto aleatorio seleccionado:", productId);
        } catch (error) {
            console.error("Error durante la solicitud al endpoint:", error);
            throw error;
        }
    });

    it("El endpoint /api/carts/ debe agregar el producto al carrito", async function () {
        try {
            const cartMock = {
                product: productId,
                user: userId
            };

            const addProductToCartResponse = await requester
                .post("/api/carts/")
                .set('Authorization', `Bearer ${authToken}`)
                .send(cartMock);

            expect(addProductToCartResponse.statusCode).to.equal(201);
            console.log("Carrito:", addProductToCartResponse.body);
            cartId = addProductToCartResponse.body._id; // Guarda el ID del carrito para su uso posterior
        } catch (error) {
            console.error("Error durante la solicitud al endpoint:", error);
            throw error;
        }
    });

    it("El endpoint /api/carts/:cid debe mostrar el carrito creado", async function () {
        try {
            const cartResponse = await requester
                .get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(cartResponse.statusCode).to.equal(200);
            console.log("El carrito:", cartResponse.body);
        } catch (error) {
            console.error("Error durante la solicitud al endpoint:", error);
            throw error;
        }
    });

    it("El endpoint /api/carts/:cid debe eliminar el carrito", async function () {
        try {
            const deleteCartResponse = await requester
                .delete(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(deleteCartResponse.statusCode).to.equal(200);
            console.log("Carrito borrado");
        } catch (error) {
            console.error("Error durante la solicitud al endpoint:", error);
            throw error;
        }
    });
});

after(async function () {
    await mongoose.disconnect();
});
*/