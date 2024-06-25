/* Falta terminar el cart
import mongoose from "mongoose";
import Assert from "assert";
import { MONGO_URL } from "../src/util.js";
import Cart from "../src/dao/models/cart.model.js";
import User from "../src/dao/models/user.model.js";
import Product from "../src/dao/models/product.model.js";

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const assert = Assert.strict;

describe("Testeo de carritos dao", function () {
    before(async function () {
        // Espera a que la conexión se establezca
        await mongoose.connection;

        // Crear un usuario de prueba
        const userId = new mongoose.Types.ObjectId();
        await User.create({
            _id: userId,
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            age: 30,
            password: "password123",
            role: "premium"
        });

        // Crear un producto de prueba
        const productId = new mongoose.Types.ObjectId();
        await Product.create({
            _id: productId,
            title: "Test Product",
            brand: "Example Brand",
            description: "This is an example product",
            price: 1000,
            stock: 10,
            category: "tecnologia",
            image: "image.jpg",
            owner: userId
        });

        // Añadir un carrito de prueba
        await Cart.create({
            stock: 10,
            total: 10000,
            country: "Country",
            state: "State",
            city: "City",
            street: "Street",
            postal_code: 12345,
            phone: 1234567890,
            card_bank: 1234567890123456,
            security_number: 123,
            products: [
                {
                    product: productId,
                    productQuantity: 2,
                    productPrice: 1000,
                    productTotal: 2000
                }
            ],
            user: userId
        });
    });

    it("El dao debe obtener los datos de los carritos en forma de array", async function () {
        const result = await Cart.find().exec();
        assert.strictEqual(Array.isArray(result), true);
        console.log(result);
    });

    after(async function () {
        // Se desconecta de la base de datos
        await User.deleteMany({ first_name: "Test" });
        await Product.deleteMany({ title: "Test Product" });
        await Cart.deleteMany({ security_number: 123 });
        await mongoose.disconnect();
    });
});
*/