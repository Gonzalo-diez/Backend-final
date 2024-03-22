import mongoose from "mongoose";
import Product from "../models/product.model.js";

const productController = {
    getProducts: async (req, res) => {
        const { category, brand } = req.query;

        try {
            let query = {};

            if (category) {
                query.category = category;
            }

            if (brand) {
                query.brand = brand;
            }

            const products = await Product.paginate(query, {limit: 3, page: 1});

            res.json(products);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
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

    getProductDetail: async (req, res) => {
        const id = req.params.id;

        try {
            const productDetail = await Product.paginate({detail: id}, {limit: 3, page: 1});

            res.json(productDetail);
        }
        catch (error) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductByCategory: async (req, res) => {
        const category = req.params.category

        try {
            const productByCategory = await Product.paginate({category: category}, {limit: 3, page: 1});
            
            res.json(productByCategory);
        }
        catch (error) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const deleteProduct = await Product.deleteOne({ _id: productId });

            const products = await Product.find();

            if (deleteProduct.deletedCount === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json({message: "Producto eliminado!", listProduct: products});
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    }
}

export default productController;