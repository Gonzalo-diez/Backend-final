import ticketService from "../services/ticket.service.js";

const ticketController = {
    createTicket: async (req, res) => {
        const userId = req.session.userId;
        const cartId = req.params.cid;

        try {
            const ticket = await ticketService.createTicket(userId, cartId);

            return res.json({ message: "Ticket creado correctamente", ticket });
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    getTicketById: async (req, res) => {
        const ticketId = req.params.tid;

        try {
            const ticket = await ticketService.getTicketById(ticketId);

            if (!ticket) {
                return res.status(404).json({ error: "Ticket no encontrado" });
            }

            return res.json(ticket);
        } catch (error) {
            console.error("Error al obtener el ticket:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    }
};

export default ticketController;