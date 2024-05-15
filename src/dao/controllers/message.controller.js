import Message from "../models/message.model.js";
import User from "../Models/user.model.js";

const messageController = {
    getMessages: async (req, res) => {
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;
        const userRole = req.session.userRole;

        try {
            const messages = await Message.find().populate('user', 'email').lean();

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
            const user = await User.findOne({ email: userEmail });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const newMessage = new Message({
                user: user._id,
                text,
            });

            await newMessage.save();

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