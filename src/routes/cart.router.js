import express from "express";
import cartController from "../dao/controllers/cart.controller.js";

const cartRouter = express.Router();

// Maneja la solicitud para ver todos los carritos
cartRouter.get("/", cartController.getCarts);

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid", cartController.getCartById);

// Maneja la solicitud para comprar productos
cartRouter.post("/products/buy", cartController.buyCart);

/* Rutas para después del desafio
// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/add", cartController.addProductToCart);

// Maneja la solicitud para agregar la cantidad de productos de un producto en el carrito
cartRouter.put("/:cid/products/:pid", cartController.addQuantityProductCart);

// Maneja la solicitud para borrar el producto del carrito
cartRouter.delete("/:cid/products/:pid", cartController.deleteProductFromCart);

// Maneja la solicitud para borrar el carrito
cartRouter.delete("/:cid", cartController.deleteCart);
*/

export default cartRouter;