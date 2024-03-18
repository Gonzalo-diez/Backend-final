import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const cartController = {
  getCart: async (req, res) => {
    try {
      const cart = await Cart.find().lean();
      return res.json(cart);
    }
    catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
  },

  addCart: async (req, res) => {
    const { productId, country, state, city, street, phone, card_bank, security_number, quantity } = req.body;

    try {
      const product = await Product.findById(productId).lean();

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ error: "Cantidad solicitada superior al stock disponible" });
      }

      product.stock -= quantity;
      await product.save();

      const cart = new Cart({
        product: productId,
        quantity: quantity,
        country,
        state,
        city,
        street,
        phone,
        card_bank,
        security_number,
        total: product.price * quantity,
      });

      await cart.save();

      return res.json({ message: "Compra exitosa, stock actualizado", Product: product });
    } catch (err) {
      return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
  },
}

export default cartController;