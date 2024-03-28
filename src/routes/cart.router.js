import express from "express";
import cartController from "../dao/controllers/cart.controller.js";

const cartRouter = express.Router();

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid", cartController.getCartById);

/*
// Maneja la solicitud para comprar productos
cartRouter.post("/products/buy", cartController.buyCart);
*/

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/add", cartController.addProductToCart);

cartRouter.put("/:cid/products/:pid", cartController.updateProductQuantityInCart);

cartRouter.delete("/:cid/products/:pid", cartController.deleteProductFromCart);

cartRouter.delete("/:cid", cartController.clearCart);

/* Rutas para después del desafio
// Maneja la solicitud para agregar la cantidad de productos de un producto en el carrito
cartRouter.put("/:cid/products/:pid", cartController.addQuantityProductCart);

// Maneja la solicitud para borrar el producto del carrito
cartRouter.delete("/:cid/products/:pid", cartController.deleteProductFromCart);

// Maneja la solicitud para borrar el carrito
cartRouter.delete("/:cid", cartController.deleteCart);
*/

export default cartRouter;