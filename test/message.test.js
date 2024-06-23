/*
import mongoose from "mongoose";
import Assert from "assert";
import { MONGO_URL } from "../src/util.js";
import Message from "../src/dao/models/message.model.js";

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const assert = Assert.strict;

describe("Testeo de mensajes dao", function() {
    before(async function() {
        // Espera a que la conexión se establezca
        await mongoose.connection;

        const userId = new mongoose.Types.ObjectId()
        
        // Añade un mensaje de prueba
        await Message.create({ 
            user: userId,
            text: "This is a text"
        });
    });

    it("El dao debe obtener los datos de los mensajes en forma de array", async function() {
        const result = await Message.find().exec();
        assert.strictEqual(Array.isArray(result), true);
        console.log(result);
    });

    after(async function() {
        // Se desconecta de la base de datos
        await Message.deleteMany({ text: "This is a text" });
        await mongoose.disconnect();
    });
});
*/