import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Message from "../models/message.model.js";

const productController = {
    getProducts: async (req, res) => {
        try {
            const products = await Product.find().populate({
                path: "messages",
                model: "Message",
            });
            res.json(products);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductDetail: async (req, res) => {
        const productDetailId = req.params.id;

        try {
            const productId = new mongoose.Types.ObjectId(productDetailId);
            const product = await Product.findOne({ _id: productId }).exec();

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductsByCategory: async (req, res) => {
        const category = req.params.category;

        try {
            const product = await Product.find({ category }).exec();
            return res.json(product);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getMessagesByProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const message = await Message.find({ product: productId }).exec();
            return res.json(message);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    addProduct: async (req, res) => {
        const { title, brand, description, price, stock, category } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const newProduct = new Product({
                title,
                brand,
                description,
                price,
                stock,
                category,
                image: imageName, 
            });

            await newProduct.save();

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });
        } catch (err) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    updateProduct: async (req, res) => {
        const productId = req.params.id;
        const { title, brand, description, price, stock, category } = req.body;

        try {
            const product = await Product.findById(productId).exec();

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    title,
                    brand,
                    description,
                    price,
                    stock,
                    category,
                    image: imageName,
                },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json("Producto actualizado!");
        } catch (err) {
            console.error("Error en la actualización:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const deleteProduct = await Product.deleteOne({ _id: productId });

            if (deleteProduct.deletedCount === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json("Producto eliminado!");
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    }
}

export default productController;