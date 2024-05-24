import express from "express";
import messageController from "../controllers/message.controller.js";
import { authToken, isUser } from "../config/auth.js";

const messageRouter = express.Router();

// Maneja la solicitud para obtener los mensajes en tiempo real
messageRouter.get("/", authToken, isUser, messageController.getMessages);

// Maneja la solicitud para agregar mensajes en tiempo real
messageRouter.post("/addMessage", authToken, isUser, messageController.addMessage);

export default messageRouter;