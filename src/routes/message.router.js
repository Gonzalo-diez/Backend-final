import express from "express";
import messageController from "../controllers/message.controller.js";
import { authToken, isUserOrPremium } from "../config/auth.js";

const messageRouter = express.Router();

// Maneja la solicitud para obtener los mensajes en tiempo real
messageRouter.get("/", authToken, isUserOrPremium, messageController.getMessages);

// Maneja la solicitud para agregar mensajes en tiempo real
messageRouter.post("/addMessage", authToken, isUserOrPremium, messageController.addMessage);

export default messageRouter;