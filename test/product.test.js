/*
import mongoose from "mongoose";
import Assert from "assert";
import { MONGO_URL } from "../src/util.js";
import Product from "../src/dao/models/product.model.js";

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const assert = Assert.strict;

describe("Testeo de productos dao", function() {
    before(async function() {
        // Espera a que la conexión se establezca
        await mongoose.connection;

        const cartId = new mongoose.Types.ObjectId();

        const userId = new mongoose.Types.ObjectId();
        
        // Añade un producto de prueba
        await Product.create({ 
            title: 'Test Product', 
            brand: 'Example Brand', 
            description: 'This is an example product', 
            price: 3000, 
            stock: 10,
            category: "tecnologia",
            image: 'image.jpg',
            cart: cartId,
            owner: userId,
        });
    });

    it("El dao debe obtener los datos de los productos en forma de array", async function() {
        const result = await Product.find().exec();
        assert.strictEqual(Array.isArray(result), true);
        console.log(result);
    });

    after(async function() {
        // Se desconecta de la base de datos
        await mongoose.disconnect();
    });
});
*/