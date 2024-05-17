import ticketRepository from "../repositories/ticket.repository.js";
import cartService from "./cart.service.js";
import TicketDTO from "../DTO/ticket.dto.js";
import { generateRandomCode } from "../../util.js";

const ticketService = {
    createTicket: async (userId, cartId) => {
        try {
            const cart = await cartService.getCartById(cartId, userId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            let totalAmount = 0;
            cart.products.forEach(item => {
                totalAmount += item.productTotal;
            });

            const ticketData = {
                code: generateRandomCode(10),
                purchase_datetime: Date.now(),
                amount: totalAmount,
                purchaser: userId
            };

            const ticket = await ticketRepository.create(ticketData);

            return new TicketDTO(ticket);
        } catch (error) {
            throw new Error("Error al crear el ticket: " + error.message);
        }
    },

    getTicketById: async (ticketId) => {
        try {
            const ticket = await ticketRepository.findById(ticketId);

            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }

            return new TicketDTO(ticket);
        } catch (error) {
            throw new Error("Error al obtener el ticket: " + error.message);
        }
    }
};

export default ticketService;