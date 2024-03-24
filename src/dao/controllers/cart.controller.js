import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
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

const cartController = {
  getCarts: async (req, res) => {
    try {
      const jsonCart = readJsonFile();
      // Obtener el carrito y poblar los productos asociados
      const cart = await Cart.find().populate({
        path: 'product',
        model: 'Product',
      }).lean();

      if (req.accepts('html')) {
        res.render("carts", { cart: cart });
      }

      return res.json(jsonCart);
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
  },

  buyCart: async (req, res) => {
    const { productId } = req.body;

    try {
      // Buscar el producto en la base de datos
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Verificar si hay suficiente stock
      if (product.stock < 1) {
        return res.status(400).json({ error: "Producto fuera de stock" });
      }

      // Crear un nuevo elemento de carrito
      const cartItem = new Cart({
        product: productId,
        quantity: 1,
        total: product.price,
      });

      await cartItem.save();

      const jsonData = readJsonFile();
      jsonData.push(cartItem.toObject());
      writeJsonFile(jsonData);

      // Actualizar el stock del producto
      product.stock -= 1;
      await product.save();

      return res.json({ message: "Producto agregado al carrito correctamente", cartItem });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Error en la base de datos", details: error.message });
    }
  },

  getCartById: async (req, res) => {
    const cartId = req.params.id;

    try {
      const cartMongo = await Cart.findById(cartId).populate({
        path: 'product',
        model: 'Product',
      }).lean();

      if (!cartMongo) {
        // Si no se encuentra el carrito en MongoDB, buscar en el archivo JSON
        const jsonCart = readJsonFile();
        const cartJSON = jsonCart.find(cart => cart._id === cartId);

        if (!cartJSON) {
          return res.status(404).json({ error: "Carrito no encontrado" });
        }

        if (req.accepts('html')) {
          return res.render('cart', { cart: cartJSON });
        }

        return res.json(cartJSON);
      }

      if (req.accepts('html')) {
        return res.render('cart', { cart: cartMongo });
      }

      return res.json(cartMongo);
    }
    catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },



  /* Metodos para después del desafio
  // Método para agregar un producto al carrito
  addProductToCart: async (req, res) => {
    const { productId } = req.body;

    try {
      // Buscar el producto en la base de datos
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Verificar si hay suficiente stock
      if (product.stock < 1) {
        return res.status(400).json({ error: "Producto fuera de stock" });
      }

      // Crear un nuevo elemento de carrito
      const cartItem = new Cart({
        product: productId,
        quantity: 1, 
        total: product.price,
      });

      await cartItem.save();

      // Actualizar el stock del producto
      product.stock -= 1;
      await product.save();

      return res.json({ message: "Producto agregado al carrito correctamente", cartItem });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Error en la base de datos", details: error.message });
    }
  },

  addQuantityProductCart: async (req, res) => {
    const cartItemId = req.params.id;
    const { quantity } = req.body;
 
    try {
      // Verificar si se proporcionó una cantidad válida
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "La cantidad proporcionada no es válida" });
      }
 
      // Buscar el elemento del carrito por su ID
      const cartItem = await Cart.findById(cartItemId);
 
      if (!cartItem) {
        return res.status(404).json({ error: "Elemento del carrito no encontrado" });
      }
 
      // Buscar el producto asociado al elemento del carrito
      const product = await Product.findById(cartItem.product);
 
      if (!product) {
        return res.status(404).json({ error: "Producto asociado al carrito no encontrado" });
      }
 
      // Calcular la cantidad a añadir al stock del producto y la cantidad total
      const quantityToAdd = quantity - cartItem.quantity;
      const newTotal = product.price * quantity;
 
      // Actualizar el stock del producto
      product.stock -= quantityToAdd;
      await product.save();
 
      // Actualizar la cantidad y el total del elemento del carrito
      cartItem.quantity = quantity;
      cartItem.total = newTotal;
      await cartItem.save();
 
      return res.json({ message: "Cantidad del producto en el carrito actualizada correctamente", updatedCartItem: cartItem });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Error en la base de datos", details: error.message });
    }
  },
 
  deleteProductFromCart: async (req, res) => {
    const cartItemId = req.params.id;
 
    try {
      const deletedCartItem = await Cart.findByIdAndDelete(cartItemId);
 
      if (!deletedCartItem) {
        return res.status(404).json({ error: "Elemento del carrito no encontrado" });
      }
 
      // Actualizar el stock del producto eliminado del carrito
      const product = await Product.findById(deletedCartItem.product);
      if (product) {
        product.stock += deletedCartItem.quantity;
        await product.save();
      }
 
      return res.json({ message: "Producto eliminado del carrito", deletedCartItem });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
  },
 
  deleteCart: async (req, res) => {
    const cartId = req.params.id;
 
    try {
      const deleteResult = await Cart.deleteMany({ _id: cartId });
 
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ error: "Carrito no encontrado o ya vacío" });
      }
 
      return res.json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Error en la base de datos", details: error.message });
    }
  },
*/
}

export default cartController;