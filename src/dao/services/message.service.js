import messageRepository from "../repositories/message.repository.js";
import MessageDTO from "../DTO/message.dto.js";
import userRepository from "../repositories/user.repository.js";
import logger from "../../utils/logger.js";

const messageService = {
    getMessages: async () => {
        try {
            logger.info("Buscando todos los mensajes");
            const messages = await messageRepository.getMessages();
            logger.info("Mensajes encontrados con exito");
            return messages;
        } catch (error) {
            logger.error(`Error al buscar los mensajes - ${error.message}`);
            throw new Error("Error en la base de datos");
        }
    },

    addMessage: async (userEmail, text) => {
        try {
            logger.info(`Agregando el mensaje del user: ${userEmail}`);
            const user = await userRepository.findByEmail(userEmail);

            if (!user) {
                logger.warn(`User no encontrado: ${userEmail}`);
                throw new Error('Usuario no encontrado');
            }

            const messageDTO = new MessageDTO(user._id, text);
            const addMessage = await messageRepository.saveMessage(messageDTO);

            logger.info(`Mensaje agregado exitosamente del user: ${userEmail}`);
            return addMessage;
        } catch (error) {
            logger.error(`Error al agregar mensaje del user: ${userEmail} - ${error.message}`);
            throw new Error("Error en la base de datos");
        }
    }
}

export default messageService;