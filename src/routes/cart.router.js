import express from "express";
import cartController from "../dao/controllers/cart.controller.js";

const cartRouter = express.Router();

// Maneja la solicitud para comprar productos en tiempo real
cartRouter.post("/addCart", cartController.addCart);

export default cartRouter;