import Ticket from "../models/ticket.model.js";

const ticketRepository = {
    create: async (ticketData) => {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    },

    findById: async (ticketId) => {
        return await Ticket.findById(ticketId).populate('purchaser').exec();
    }
};

export default ticketRepository;