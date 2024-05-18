import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        index: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product: { type: String, required: true },
            productQuantity: { type: Number, required: true },
            productTotal: { type: Number, required: true }
        }
    ]
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;