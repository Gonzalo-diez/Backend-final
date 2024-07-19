import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: { type: Number, min: 0 },
            unitPrice: { type: Number, min: 0 },
            totalPrice: { type: Number, min: 0 }
        }
    ],
    shipping: {
        country: String,
        state: String,
        city: String,
        street: String,
        postalCode: Number,
        phone: { type: Number, min: 1000000000, max: 999999999999999 }
    },
    payment: {
        cardBank: { type: Number, min: 1000000000000000, max: 9999999999999999 },
        securityNumber: { type: Number, min: 100, max: 999 },
        expiredDate: Date,
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});


const Purchase = mongoose.model("Purchase", purchaseSchema);


export default Purchase;