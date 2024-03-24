import mongoose from "mongoose";
import Product from "../models/product.model.js";
import fs from "fs";
import { getProductsFilePath } from "../../util.js";

// Ruta del archivo JSON
const jsonFilePath = getProductsFilePath();

// Función para leer datos del archivo JSON
const readJsonFile = () => {
    try {
        const jsonData = fs.readFileSync(jsonFilePath);
        return jsonData.length > 0 ? JSON.parse(jsonData) : [];
    } catch (error) {
        console.error("Error al leer el archivo JSON:", error);
        return [];
    }
};

// Función para escribir datos en el archivo JSON
const writeJsonFile = (data) => {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al escribir en el archivo JSON:", error);
    }
};

const productController = {
    getProducts: async (req, res) => {
        const { category, brand, sort } = req.query;

        try {
            // Obtener productos del archivo JSON
            const jsonProducts = readJsonFile();

            let query = {};

            if (category) {
                query.category = category;
            }

            if (brand) {
                query.brand = brand;
            }

            const options = {
                limit: 3,
                page: 1,
                sort: { price: sort === 'asc' ? 1 : -1 }
            };

            const filter = await Product.paginate(query, options);
            const products = filter.docs.map(product => product.toObject());

            if (req.accepts('html')) {
                return res.render('realTimeProducts', { Products: products, Query: filter });
            }

            res.json({ Products: jsonProducts });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    /* Metodos para proximo desafio
    getProductDetail: async (req, res) => {
        const productId = req.params.id;

        try {
            const productDetail = await Product.findOne({ _id: productId }).lean();

            if (req.accepts('html')) {
                return res.render('product', { Product: productDetail });
            }

            res.json(productDetail);
        }
        catch (error) {
            console.error("Error al ver los detalles:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getProductByCategory: async (req, res) => {
        const category = req.params.category

        try {
            const productByCategory = await Product.find({category}).lean();

            if (req.accepts("html")) {
                return res.render("category", {Category: productByCategory});
            }
            
            res.json(productByCategory);
        }
        catch (error) {
            console.error("Error al buscar la categoria:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
    */

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

            const jsonData = readJsonFile();
            jsonData.push(newProduct.toObject());
            writeJsonFile(jsonData);

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });
        } catch (err) {
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

            const rawData = fs.readFileSync(jsonFilePath);
            let jsonData = JSON.parse(rawData);

            const index = jsonData.findIndex(product => product.id === productId);

            if (index === -1) {
                return res.status(404).json({ error: "Producto no encontrado en el archivo JSON" });
            }

            // Elimina el producto del array de productos
            jsonData.splice(index, 1);

            // Guarda el array actualizado de productos en el archivo JSON
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

            return res.json({ message: "Producto eliminado!", listProduct: products });
        } catch (err) {
            console.error('Error al borrar el producto:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    }
}

export default productController;