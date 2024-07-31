import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { MONGO_URL } from "../src/util.js";
import __dirname from "../src/util.js";

const requester = supertest("http://localhost:8080");

describe("Product tests", async function () {
    this.timeout(10000);

    let user;
    let authToken;
    let userId;
    let userRole;
    let productId;
    let productMock;
    let updateProductMock;

    const userCredentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    before(async function () {
        //Conectarse a base de datos
        await mongoose.connect(MONGO_URL);

        // Realizar login
        const loginResponse = await requester
            .post("/api/sessions/login")
            .send(userCredentials);

        expect(loginResponse.statusCode).to.equal(200);
        user = loginResponse.body;
        userId = loginResponse.body.userId;
        userRole = loginResponse.body.userRole;
        authToken = loginResponse.body.access_token;
        console.log("Login exitoso:", loginResponse.body);

        productMock = {
            title: 'Test Product',
            brand: 'Example Brand',
            description: 'Ejemplo de producto',
            price: 3000,
            stock: 10,
            category: "tecnologia",
        };
        
        updateProductMock = {
            productUpdateData: {
                title: 'Test Update Product',
                brand: 'Example Update Brand',
                description: 'Ejemplo de producto actualizado',
                price: 4500,
                stock: 5,
                category: "tecnologia"
            },
            userId: userId,
            userRole: userRole
        }        
    });

    describe("Prueba de agregado de producto", () => {
        it("El endpoint /api/products/ debera de agregar un producto", async function () {
            try {
                const imagePath = path.resolve(__dirname, 'public/products', 'ps.png');

                const addProduct = await requester
                    .post("/api/products/")
                    .set('Authorization', `Bearer ${authToken}`)
                    .field('title', productMock.title)
                    .field('brand', productMock.brand)
                    .field('description', productMock.description)
                    .field('price', productMock.price)
                    .field('stock', productMock.stock)
                    .field('category', productMock.category)
                    .field('owner', userId)
                    .attach('image', fs.createReadStream(imagePath));

                expect(addProduct.statusCode).to.equal(200);
                console.log("Producto agregado:", addProduct.body);
                productId = addProduct.body._id;
                console.log("ID DEL PRODUCTO:", productId);
            } catch (error) {
                console.log("Error al agregar el producto", error.response ? error.response.body : error);
                throw error;
            }
        });
    });
    
    describe("Prueba de vista de productos", () => {
        it("El endpoint /api/products debera mostrar la vista de productos", async function () {
            try {
                const getProducts = await requester
                    .get("/api/products")

                expect(getProducts.statusCode).to.equal(200);
                console.log("Vista de productos:", getProducts.text);
            } catch (error) {
                console.log("Error en la vista de productos", error.response ? error.response.body : error);
                throw error;
            }
        });
    });

    describe("Prueba de vista del producto creado", () => {
        it("El endpoint /api/products/:pid debera de mostrar la vista del producto creado", async function () {
            try {
                const getCreatedProduct = await requester
                    .get(`/api/products/${productId}`)

                expect(getCreatedProduct.statusCode).to.equal(200);
                console.log("Vista de producto creado", getCreatedProduct.text);
            } catch (error) {
                console.log("Error en la vista del producto creado", error.response ? error.response.body : error);
                throw error;
            }
        });    
    });

    describe("Prueba de actualización del producto", () => {
        it("El endpoint /api/products/:pid deberá de actualizar el producto con el updateProductMock", async function () {
            try {
                const imagePath = path.resolve(__dirname, 'public/products', 'ps.png');
    
                const updateProduct = await requester
                    .put(`/api/products/${productId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .field('title', updateProductMock.productUpdateData.title)
                    .field('brand', updateProductMock.productUpdateData.brand)
                    .field('description', updateProductMock.productUpdateData.description)
                    .field('price', updateProductMock.productUpdateData.price)
                    .field('stock', updateProductMock.productUpdateData.stock)
                    .field('category', updateProductMock.productUpdateData.category)
                    .field('userId', updateProductMock.userId)
                    .field('userRole', updateProductMock.userRole)
                    .attach('image', fs.createReadStream(imagePath));
    
                console.log("En caso de error al actualizar el producto:", updateProduct.body);
                expect(updateProduct.statusCode).to.equal(200);
                console.log("Producto actualizado:", updateProduct.body);
            } catch (error) {
                console.log("Error al actualizar el producto", error.response ? error.response.body : error);
                throw error;
            }
        });
    });    

    describe("Prueba de eliminación del producto creado", () => {
        it("El endpoint /api/products/:pid debera de eliminar el producto creado", async function () {
            try {
                const deleteProduct = await requester
                    .delete(`/api/products/${productId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ userId, userRole });

                expect(deleteProduct.statusCode).to.equal(200);
                console.log("Producto eliminado:", deleteProduct.body);
            } catch (error) {
                console.log("Error al eliminar el producto", error.response ? error.response.body : error);
                throw error;
            }
        });    
    });

    after(async function () {
        await mongoose.disconnect();
    });
});