import fs from "fs";
import { getCartFilePath } from "../../util.js";

const jsonFilePath = getCartFilePath();

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


class cartManager {
    async createCart(req, res) {
        try {
            const carritos = readJsonFile(jsonFilePath);
            
            const newCartId = Math.max(...carritos.map(cart => cart.id), 0) + 1;
            
            const newCart = {
                id: newCartId,
                products: [] 
            };
            
            carritos.push(newCart);
            
            writeJsonFile(jsonFilePath, carritos);

            res.status(201).json({ message: "Carrito creado exitosamente", cart: newCart });
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllCarts(req, res) {
        try {
            const carritos = readJsonFile(jsonFilePath);
            res.json(carritos);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getCartById(req, res) {
        try {
            const cid = parseInt(req.params.cid);
            const carritos = readJsonFile(jsonFilePath);
            const cart = carritos.find(cart => cart.id === cid);
            if (!cart) {
                res.status(404).json({ error: "Carrito no encontrado" });
            } else {
                res.json(cart);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cid = parseInt(req.params.cid);
            const pid = parseInt(req.params.pid);
            const { quantity } = req.body;

            if (!quantity || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: "Cantidad invalida" });
            }

            let carritos = readJsonFile(jsonFilePath);

            const cartIndex = carritos.findIndex(cart => cart.id === cid);

            if (cartIndex === -1) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            const productToAdd = {
                product: pid,
                quantity: parseInt(quantity)
            };

            const existingProductIndex = carritos[cartIndex].products.findIndex(item => item.product === pid);

            if (existingProductIndex !== -1) {
                carritos[cartIndex].products[existingProductIndex].quantity += parseInt(quantity);
            } else {
                carritos[cartIndex].products.push(productToAdd);
            }

            writeJsonFile(jsonFilePath, carritos);

            res.json({ message: "Producto agregado al carrito exitosamente", cart: carritos[cartIndex] });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default cartManager;
