import express from "express";
import messageController from "../dao/controllers/message.controller.js";

const messageRouter = express.Router();

// Maneja la solicitud para agregar mensajes en tiempo real
messageRouter.post("/addMessage", messageController.addMessage);

// Maneja la solicitud para editar mensajes en tiempo real
messageRouter.put("/editMessage/:id", messageController.updateMessage);

// Maneja la solicitud para borrar mensajes en tiempo real
messageRouter.delete("/deleteMessage/:id", messageController.deleteMessage);

// Maneja la solicitud para responder a los mensajes en tiempo real
messageRouter.post("/respondMessage/:id", messageController.respondMessage);

export default messageRouter;