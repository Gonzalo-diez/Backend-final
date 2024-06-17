/*
import mongoose from "mongoose";
import Assert from "assert";
import { MONGO_URL } from "../src/util.js";
import User from "../src/dao/models/user.model.js";

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const assert = Assert.strict;

describe("Testeo de usuarios dao", function() {
    before(async function() {
        // Espera a que la conexión se establezca
        await mongoose.connection;

        const cartId = new mongoose.Types.ObjectId()
        
        // Añade un usuario de prueba
        await User.create({ 
            first_name: 'Test', 
            last_name: 'User', 
            email: 'test@example.com', 
            age: 30, 
            password: 'password123',
            cart: cartId,
            role: 'user',
            resetToken: '',
            resetTokenExpires: new Date()
        });
    });

    it("El dao debe obtener los datos de los usuarios en forma de array", async function() {
        const result = await User.find().exec();
        assert.strictEqual(Array.isArray(result), true);
        console.log(result)
    });

    after(async function() {
        // Se desconecta de la base de datos
        await mongoose.disconnect();
    });
});
*/