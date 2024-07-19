import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    stock: Number,
    total: Number,
    country: String,
    state: String,
    city: String,
    street: String,
    postal_code: Number,
    phone: Number,
    card_bank: { type: Number, max: 16 },
    security_number: { type: Number, max: 3 },
    expiredDate: Date,
    date: {
        type: Date,
        default: Date.now,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            productQuantity: { type: Number, min: 0 },
            productPrice: { type: Number, min: 0 },
            productTotal: { type: Number, min: 0 },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;