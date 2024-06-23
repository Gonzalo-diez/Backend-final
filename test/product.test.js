/* Falta arreglar el problema en la creacion del producto
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MONGO_URL } from "../src/util.js";
import Product from "../src/dao/models/product.model.js";

mongoose.connect(MONGO_URL);

const requester = supertest("http://localhost:8080");

describe("Testeo de productos dao", function () {
    let authToken;
    let userId;
    let productId;

    const userCredentials = {
        email: 'newtest@example.com',
        password: 'password123'
    };

    const productMock = {
        title: 'Test Product',
        brand: 'Example Brand',
        description: 'This is an example product',
        price: 3000,
        stock: 10,
        category: "tecnologia",
        image: 'image.jpg',
    };

    before(async function () {
        // Connect to the database
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        // Login to get the authentication token
        const loginResponse = await requester.post("/api/sessions/login").send(userCredentials);
        expect(loginResponse.statusCode).to.equal(200);
        authToken = loginResponse.body.access_token;
        userId = loginResponse.body.message._id; // Corrección de asignación de userId
        console.log("Token:", authToken);
        console.log("UserId:", userId);
        console.log("User:", loginResponse.body);
    });

    beforeEach(async function () {
        // Añadimos el userId al productMock
        productMock.owner = userId;

        // Create the product if it doesn't exist
        const existingProduct = await Product.findOne({ title: productMock.title });

        if (existingProduct) {
            productId = existingProduct._id;
            console.log("El producto ya existe.");
        } else {
            try {
                const createProductResponse = await requester
                    .post("/api/products/")
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(productMock);

                console.log("Respuesta de creación de producto:", createProductResponse.body);
                expect(createProductResponse.statusCode).to.equal(200);
                productId = createProductResponse.body._id;
            } catch (error) {
                console.error("Error durante la creación del producto:", error);
                throw error;
            }
        }
    });

    describe("Test para ver el producto creado", () => {
        it("El endpoint /api/products/:pid debe retornar el producto creado", async function () {
            try {
                const { statusCode, body } = await requester.get(`/api/products/${productId}`);
                console.log("Estado de la respuesta:", statusCode);
                console.log("Cuerpo de la respuesta:", body);

                expect(statusCode).to.equal(200);
                expect(body).to.be.an('object');
                expect(body.response).to.be.an('object');
                expect(body.response.Products).to.be.an('array');
            } catch (error) {
                console.error("Error durante la solicitud al endpoint:", error);
                throw error;
            }
        });
    });

    after(async function () {
        // Clean up created product after tests
        await Product.deleteOne({ _id: productId });
        // Disconnect mongoose
        await mongoose.disconnect();
    });
});
*/