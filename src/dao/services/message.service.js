import messageRepository from "../repositories/message.repository.js";
import MessageDTO from "../DTO/message.dto.js";
import userRepository from "../repositories/user.repository.js";
import logger from "../../utils/logger.js";

const messageService = {
    getMessages: async () => {
        try {
            logger.info("Fetching all messages");
            const messages = await messageRepository.getMessages();
            logger.info("Messages fetched successfully");
            return messages;
        } catch (error) {
            logger.error(`Error fetching messages - ${error.message}`);
            throw new Error("Error en la base de datos");
        }
    },

    addMessage: async (userEmail, text) => {
        try {
            logger.info(`Adding message for user: ${userEmail}`);
            const user = await userRepository.findByEmail(userEmail);

            if (!user) {
                logger.warn(`User not found: ${userEmail}`);
                throw new Error('Usuario no encontrado');
            }

            const messageDTO = new MessageDTO(user._id, text);
            const addMessage = await messageRepository.saveMessage(messageDTO);

            logger.info(`Message added successfully for user: ${userEmail}`);
            return addMessage;
        } catch (error) {
            logger.error(`Error adding message for user: ${userEmail} - ${error.message}`);
            throw new Error("Error en la base de datos");
        }
    }
}

export default messageService;