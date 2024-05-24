import messageService from "../dao/services/message.service.js";

const messageController = {
    getMessages: async (req, res) => {
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;
        const userRole = req.session.userRole;

        try {
            const messages = await messageService.getMessages()

            if (req.accepts('html')) {
                return res.render('chat', { messages, user, isAuthenticated, jwtToken, userRole });
            }
            res.json(messages);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addMessage: async (req, res) => {
        const { userEmail, text } = req.body;

        try {
            const newMessage = await messageService.addMessage(userEmail, text);

            return res.json({
                message: 'Mensaje agregado',
                Message: newMessage,
            });
        } catch (err) {
            console.error('Error al guardar el mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },
}

export default messageController;