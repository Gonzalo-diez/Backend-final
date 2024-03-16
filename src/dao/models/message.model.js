import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: String,
    name: String,
    date: {
        type: Date,
        default: Date.now,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    responses: [{
        text: String,
        name: String,
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

const Message = mongoose.model("Message", messageSchema);

export default Message;