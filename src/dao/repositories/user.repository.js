import User from "../Models/user.model.js";

const userRepository = {
    findByEmail: async (email) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por correo electrónico: " + error.message);
        }
    },

    findById: async (userId, useLean = false) => {
        try {
            if (useLean) {
                const user = await User.findById(userId).lean();
                return user;
            } else {
                const user = await User.findById(userId).populate('createdProducts');
                return user;
            }
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
};

export default userRepository;