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

    addCreatedProduct: async (userId, productId) => {
        try {
            // Buscar al usuario por su ID
            const user = await User.findById(userId);

            // Verificar si el usuario existe
            if (!user) {
                throw new Error("El usuario no existe");
            }

            // Agregar el ID del producto creado a la lista de productos creados por el usuario
            user.createdProducts.push(productId);

            // Guardar los cambios en la base de datos
            await user.save();

            return user;
        } catch (error) {
            throw new Error("Error al agregar el producto creado al usuario: " + error.message);
        }
    }
};

export default userRepository;