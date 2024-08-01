import Ticket from "../models/ticket.model.js";

const ticketRepository = {
    // Método para crear el ticket de compra
    createTicket: async (ticketData) => {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }
}

export default ticketRepository;