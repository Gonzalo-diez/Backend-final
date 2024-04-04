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
cartRouter.post("/", cartController.addProductToCart);

// Maneja la solicitud para actualizar el carrito con nuevos productos
cartRouter.put("/:cid", cartController.updateCart);

// Maneja la solicitud para actualizar la cantidad de algun producto dentro del carrito
cartRouter.put("/:cid/products/:pid", cartController.updateProductQuantityInCart);

// Maneja la solicitud para borrar el producto seleccionado del carrito
cartRouter.delete("/:cid/products/:pid", cartController.deleteProductFromCart);

// Maneja la solicitud para limpiar el carrito
cartRouter.delete("/:cid", cartController.clearCart);

export default cartRouter;