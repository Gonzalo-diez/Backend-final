import express from "express";
import ticketController from "../dao/controllers/ticket.controller.js";
import { authToken, isUser } from "../config/auth.js";

const ticketRouter = express.Router();

ticketRouter.post("/:cid", authToken, isUser, ticketController.createTicket);
ticketRouter.get("/:tid", authToken, isUser, ticketController.getTicketById);

export default ticketRouter;