import express from "express";
import cartController from "../dao/controllers/cart.controller.js";

const cartRouter = express.Router();

// Maneja la solicitud para comprar productos en tiempo real
cartRouter.put("/:cid", cartController.addCart);

// Maneja la solicitud para agregar la cantidad de productos de un producto en el carrito
cartRouter.put("/:cid/products/:pid");

// Maneja la solicitud para borrar el producto del carrito
cartRouter.delete("/:cid/products/:pid");

// Maneja la solicitud para borrar el carrito
cartRouter.delete("/:cid");

export default cartRouter;