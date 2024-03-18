import mongoose from "mongoose";
import Message from "../models/message.model.js";

const messageController = {
    getMessages: async (req, res) => {
        try {
            const messages = await Message.find().lean();

            if (req.accepts('html')) {
                return res.render('chat', { messages });
            }
            res.json(messages);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addMessage: async (req, res) => {
        const { user, message } = req.body;

        try {
            const newMessage = new Message({
                user,
                message,
            });

            await newMessage.save();

            return res.json('Mensaje agregado');
        } catch (err) {
            console.error('Error al guardar el mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    updateMessage: async (req, res) => {
        const id = req.params.id;
        const { message } = req.body;

        try {
            const messageId = await Message.findById(id).lean().exec();

            if (!messageId) {
                return res.status(404).json({ error: "Mensaje no encontrado" });
            }

            const updatedMessage = await Message.findByIdAndUpdate(
                id,
                { message },
                { new: true }
            );

            if (!updatedMessage) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }

            return res.json('Mensaje actualizado');
        } catch (err) {
            console.error('Error en la actualización del mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    deleteMessage: async (req, res) => {
        const messageId = req.params.id;

        try {
            const deleteMessage = await Message.deleteOne({ _id: messageId }).lean();

            if (deleteMessage.deletedCount === 0) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }

            return res.json('Mensaje eliminado');
        } catch (err) {
            console.error('Error al eliminar el mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    respondMessage: async (req, res) => {
        const id = req.params.id;
        const { user, message } = req.body;

        try {
            const messageId = await Message.findById(id).lean().exec();
            if (!messageId) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }

            message.responses.push({
                user,
                message,
                date: new Date(),
            });

            await message.save();

            return res.json('Respuesta agregada al mensaje');
        } catch (err) {
            console.error('Error al responder al mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },
}

export default messageController;