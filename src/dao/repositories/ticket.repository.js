import Ticket from "../models/ticket.model.js";

const ticketRepository = {
    createTicket: async (ticketData) => {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }
}

export default ticketRepository;