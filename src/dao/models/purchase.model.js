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
        phone: Number
    },
    payment: {
        cardBank: Number,
        securityNumber: Number
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});


const Purchase = mongoose.model("Purchase", purchaseSchema);


export default Purchase;