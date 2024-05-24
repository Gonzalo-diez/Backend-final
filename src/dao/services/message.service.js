import messageRepository from "../repositories/message.repository.js";
import MessageDTO from "../DTO/message.dto.js";
import userRepository from "../repositories/user.repository.js";

const messageService = {
    getMessages: async() => {
        try {
            const messages = await messageRepository.getMessages();

            return messages;
        }
        catch (error) {
            throw new Error("Error en la base de datos");
        }
    },

    addMessage: async (userEmail, text) => {
        try {
            const user = await userRepository.findByEmail(userEmail);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const messageDTO = new MessageDTO(user._id, text);

            const addMessage = await messageRepository.saveMessage(messageDTO);

            return addMessage;
        }
        catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
}

export default messageService;