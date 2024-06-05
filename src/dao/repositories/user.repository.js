import User from "../models/user.model.js";

const userRepository = {
    findByEmail: async (email) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por correo electrónico: " + error.message);
        }
    },

    findById: async (userId) => {
        try {
            const user = await User.findById(userId).lean();
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por ID: " + error.message);
        }
    },
    
    findUser: async (userId) => {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por ID: " + error.message);
        }
    },

    createUser: async (userData) => {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error("Error al crear usuario: " + error.message);
        }
    },

    findByResetToken: async (token) => {
        try {
            const user = await User.findOne({ resetToken: token });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por token de restablecimiento: " + error.message);
        }
    },

    updateUser: async (userId, updateData) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    }
};

export default userRepository;