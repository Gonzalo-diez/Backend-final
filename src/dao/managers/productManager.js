import fs from "fs";
import { getProductsFilePath } from "../../util";

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

class productManager {
    async getProducts(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : null;
            const productos = readJsonFile(jsonFilePath);
            
            let result = productos;
            if (limit) {
                result = productos.slice(0, limit);
            }
            
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getProductById(req, res) {
        try {
            const pid = parseInt(req.params.pid);
            const productos = readJsonFile(jsonFilePath);
            
            const product = productos.find(producto => producto.id === pid);
            
            if (!product) {
                res.status(404).json({ error: "Producto no encontrado" });
            } else {
                res.json(product);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addProduct(req, res) {
        try {
            const {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail
            } = req.body;

            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).json({ error: "Faltan campos requeridos" });
            }

            let productos = readJsonFile(jsonFilePath);
            
            const newProduct = {
                id: productos.length + 1,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnail
            };

            productos.push(newProduct);

            writeJsonFile(jsonFilePath, productos);

            res.status(201).json({ message: "Producto agregado exitosamente", product: newProduct });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateProduct(req, res) {
        try {
            const pid = parseInt(req.params.pid);
            const updateFields = req.body;
            
            if (!Object.keys(updateFields).length) {
                return res.status(400).json({ error: "No fields to update provided" });
            }

            let productos = readJsonFile(jsonFilePath);

            const index = productos.findIndex(producto => producto.id === pid);
            
            if (index === -1) {
                return res.status(404).json({ error: "Product not found" });
            }

            const updatedProduct = { ...productos[index] };

            for (const field in updateFields) {
                if (field !== "id") {
                    updatedProduct[field] = updateFields[field];
                }
            }

            productos[index] = updatedProduct;

            writeJsonFile(jsonFilePath, productos);

            res.json({ message: "Product updated successfully", product: updatedProduct });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteProduct(req, res) {
        try {
            const pid = parseInt(req.params.pid);

            let productos = readJsonFile(jsonFilePath);

            const index = productos.findIndex(producto => producto.id === pid);
            
            if (index === -1) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            productos.splice(index, 1);

            writeJsonFile(jsonFilePath, productos);

            res.json({ message: "Producto eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default productManager;
