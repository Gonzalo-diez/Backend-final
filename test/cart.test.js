import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MONGO_URL } from "../src/util.js";

const requester = supertest("http://localhost:8080");

describe("Cart Tests", function () {
    let user;
    let userId;
    let userRole;
    let authToken;
    let cartMock;
    let updateCartMock;
    let updateQuantityProductMock;
    let cartId;

    const userCredentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    before(async function () {
        await mongoose.connect(MONGO_URL);

        const loginResponse = await requester
            .post("/api/sessions/login")
            .send(userCredentials);

        expect(loginResponse.statusCode).to.equal(200);
        user = loginResponse.body;
        userId = loginResponse.body.message._id;
        userRole = loginResponse.body.message.role;
        authToken = loginResponse.body.access_token;
        console.log("Login exitoso:", loginResponse.body);
        console.log("UserId: ", userId);

        cartMock = {
            productId: "667ccbb4b05b03f8181be1d5",
            userId: userId,
            userRole: userRole,
        };

        updateQuantityProductMock = {
            quantity: 3,
            userId: userId,
        };

        updateCartMock = {
                userId: userId,
                products: [
                    {
                        "product": "667ccbb3b05b03f8181be1cf",
                        "productQuantity": 2,
                        "productPrice": 1350000,
                        "productPrice": 2700000
                    },
                    {
                        "product": "667ccbb4b05b03f8181be1d8",
                        "productQuantity": 3,
                        "productPrice": 1350000,
                        "productTotal": 4050000
                    }
                ],
                "total": 6750000
            }
    });

    describe("Prueba de agregar el producto al carrito del usuario", () => {
        it("El endpoint /api/carts/ debera de agregar el cartMock al carrito", async function () {
            try {
                const addProductToCart = await requester
                    .post("/api/carts/")
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(cartMock);

                expect(addProductToCart.statusCode).to.equal(200);
                console.log("Producto en carrito:", addProductToCart.body);
                cartId = addProductToCart.body.cartItemId;
            } catch (error) {
                console.log("Error al agregar el producto al carrito", error.response ? error.response.body : error);
                throw error;
            }
        });
    });

    describe("Prueba de agregado de más cantidad al producto en el carrito", () => {
        it("El endpoint /api/carts/:cid/products/:pid", async function () {
            try {
                const updateProductQuantityInCart = await requester
                    .put(`/api/carts/${cartId}/products/${cartMock.productId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateQuantityProductMock);

                expect(updateProductQuantityInCart.statusCode).to.equal(200);
                console.log("Producto en el carrito actualizado:", updateProductQuantityInCart.body);
            } catch (error) {
                console.log("Error al actualizar el producto del carrito", error.response ? error.response.body : error);
                throw error;
            }
        })
    })

    describe("Prueba de agregado de otros productos al carrito", () => {
        it("El endpoint /api/carts/:cid debera de agregar un listado de nuevos productos al carrito", async function () {
            try {
                const updateCart = await requester
                    .put(`/api/carts/${cartId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateCartMock);

                console.log("En caso de error al actualizar el carrito:", updateCart.body);
                expect(updateCart.statusCode).to.equal(200);
                console.log("Carrito actualizado:", updateCart.body.products);
            } catch (error) {
                console.log("Error al actualizar el carrito", error.response ? error.response.body : error);
                throw error;
            }
        });
    });

    describe("Prueba de eliminación del producto del carrito", () => {
        it("El endpoint /api/carts/:cid/products/:pid debera de eliminar el producto del carrito", async function () {
            try {   
                const deleteProductInCart = await requester
                    .delete(`/api/carts/${cartId}/products/${cartMock.productId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(userId);

                expect(deleteProductInCart.statusCode).to.equal(200);
                console.log("Eliminación del producto:", deleteProductInCart.body);
            } catch (error) {
                console.log("Error al eliminar el producto del carrito", error.response ? error.response.body : error);
                throw error;
            }
        });
    });

    describe("Prueba de eliminación del carrito", () => {
        it("El endpoint /api/carts/:cid debera de eliminar el carrito", async function () {
            try {
                const deleteCart = await requester
                    .delete(`/api/carts/${cartId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(userId);
                
                expect(deleteCart.statusCode).to.equal(200);
                console.log("Eliminación del carrito exitosa:", deleteCart.body);
            } catch (error) {
                console.log("Error el carrito", error.response ? error.response.body : error);
                throw error;
            }
        });
    });
    
    after(async function () {
        await mongoose.disconnect();
    });
});