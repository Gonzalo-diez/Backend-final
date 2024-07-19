import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    stock: Number,
    total: Number,
    country: String,
    state: String,
    city: String,
    street: String,
    postal_code: Number,
    phone: { type: Number, min: 1000000000, max: 999999999999999 },
    cardBank: { type: Number, min: 1000000000000000, max: 9999999999999999 },
    securityNumber: { type: Number, min: 100, max: 999 },
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