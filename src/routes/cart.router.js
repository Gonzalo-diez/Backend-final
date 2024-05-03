import express from "express";
import cartController from "../dao/controllers/cart.controller.js";
import { authToken } from "../config/auth.js";

const cartRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid", authToken, cartController.getCartById);

/*
// Maneja la solicitud para comprar productos
cartRouter.post("/products/buy", cartController.buyCart);
*/

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/", authToken, cartController.addProductToCart);

// Maneja la solicitud para actualizar el carrito con nuevos productos
cartRouter.put("/:cid", authToken, cartController.updateCart);

// Maneja la solicitud para actualizar la cantidad de algun producto dentro del carrito
cartRouter.put("/:cid/products/:pid", authToken, cartController.updateProductQuantityInCart);

// Maneja la solicitud para borrar el producto seleccionado del carrito
cartRouter.delete("/:cid/products/:pid", authToken, cartController.deleteProductFromCart);

// Maneja la solicitud para limpiar el carrito
cartRouter.delete("/:cid", authToken, cartController.clearCart);

export default cartRouter;