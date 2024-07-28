import messageService from "../dao/services/message.service.js";

const messageController = {
    getMessages: async (req, res) => {
        const user = req.session.user;
        const jwtToken = req.session.token;
        const userRole = req.session.userRole;
        const isAuthenticated = req.session.isAuthenticated;

        try {
            // Obtiene todos los mensajes de los usuarios
            const messages = await messageService.getMessages()

            if (req.accepts('html')) {
                return res.render('chat', { messages, user, jwtToken, userRole, isAuthenticated });
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
            // Agrega el mensaje del usuario al chat
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