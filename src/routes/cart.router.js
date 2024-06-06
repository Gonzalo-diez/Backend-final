import express from "express";
import cartController from "../controllers/cart.controller.js";
import { authToken, isUserOrPremium } from "../config/auth.js";

const cartRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid", authToken, isUserOrPremium, cartController.getCartById);

// Maneja el renderiza del formulario para realizar la compra del carrito
cartRouter.get("/:cid/purchase", authToken, isUserOrPremium, cartController.getPurchaseCart);

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/", authToken, isUserOrPremium, cartController.addProductToCart);

// Maneja la solicitud para actualizar el carrito con nuevos productos
cartRouter.put("/:cid", authToken, isUserOrPremium, cartController.updateCart);

// Maneja la solicitud para actualizar la cantidad de algun producto dentro del carrito
cartRouter.put("/:cid/products/:pid", authToken, isUserOrPremium, cartController.updateProductQuantityInCart);

// Maneja la solicitud de compra del carrito
cartRouter.post("/:cid/purchase", authToken, isUserOrPremium, cartController.purchaseCart);

// Maneja la solicitud para borrar el producto seleccionado del carrito
cartRouter.delete("/:cid/products/:pid", authToken, isUserOrPremium, cartController.deleteProductFromCart);

// Maneja la solicitud para limpiar el carrito
cartRouter.delete("/:cid", authToken, isUserOrPremium, cartController.clearCart);

export default cartRouter;