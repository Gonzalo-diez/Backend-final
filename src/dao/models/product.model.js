import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    brand: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    image: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
});

const Product = mongoose.model("Product", productSchema);

export default Product;