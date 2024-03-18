import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    date: {
        type: Date,
        default: Date.now,
    },
    // Implementación de respuesta de mensajes más adelante
    responses: [{
        user: String,
        message: String,
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

const Message = mongoose.model("Message", messageSchema);

export default Message;