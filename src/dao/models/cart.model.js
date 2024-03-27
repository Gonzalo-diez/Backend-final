import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    stock: Number,
    total: Number,
    country: String,
    state: String,
    city: String,
    street: String,
    postal_code: Number,
    phone: Number,
    card_Bank: Number,
    security_Number: Number,
    date: {
        type: Date,
        default: Date.now,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;