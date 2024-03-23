import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
    },
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

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);

export default Product;