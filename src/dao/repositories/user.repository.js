import User from "../models/user.model.js";

const userRepository = {
    // Método para traer la lista de usuarios con páginación
    getUsers: async (currentPage) => {
        try {
            const options = {
                limit: 10,
                page: currentPage,
            };

            let dbQuery = {};

            const filter = await User.paginate(dbQuery, options);
            const users = filter.docs.map(user => user.toObject());

            // Links para las páginas siguientes y anteriores
            let prevLink = null;
            if (filter.hasPrevPage) {
                prevLink = `/api/sessions/?page=${filter.prevPage}`;
            }

            let nextLink = null;
            if (filter.hasNextPage) {
                nextLink = `/api/sessions/?page=${filter.nextPage}`;
            }
            
            const response = {
                status: 'success',
                Users: users,
                query: {
                    totalDocs: filter.totalDocs,
                    limit: filter.limit,
                    totalPages: filter.totalPages,
                    page: filter.page,
                    pagingCounter: filter.pagingCounter,
                    hasPrevPage: filter.hasPrevPage,
                    hasNextPage: filter.hasNextPage,
                    prevPage: filter.prevPage,
                    nextPage: filter.nextPage,
                    prevLink: prevLink,
                    nextLink: nextLink
                },
            };

            return response;
        } catch (error) {
            throw new Error("Error al buscar todos los usuarios: " + error.message)
        }
    },

    // Método para buscar el usuario por su email
    findByEmail: async (email) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por correo electrónico: " + error.message);
        }
    },

    // Método para buscar el usuario en la base de datos y que pueda ver los datos en el handlebars
    findById: async (userId) => {
        try {
            const user = await User.findById(userId).lean();
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por ID: " + error.message);
        }
    },
    
    // Método para buscar el usuario en la base de datos
    findUser: async (userId) => {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por ID: " + error.message);
        }
    },

    // Método para buscar a los usuarios inactivos
    findInactiveUser: async (inactivityPeriod) => {
        const inactivityDate = new Date(Date.now() - inactivityPeriod);
        try {
            const user = await User.findOne({ last_connection: { $lt: inactivityDate } });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuarios inactivos: " + error.message);
        }
    },

    // Método para eliminar a los usuarios inactivos
    deleteInactiveUser: async (userId) => {
        try {
            const deleteInactiveUser = await User.deleteOne({ _id: userId });
            return deleteInactiveUser;
        } catch (error) {
            throw new Error("Error al eliminar el usuario inactivo: " + error.message);
        }
    },

    // Método para crear a los usuarios en el registro
    createUser: async (userData) => {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error("Error al crear usuario: " + error.message);
        }
    },

    // Método para buscar el usuario por el token enviado
    findByResetToken: async (token) => {
        try {
            const user = await User.findOne({ resetToken: token });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por token de restablecimiento: " + error.message);
        }
    },

    // Método para actualizar el token de restablecimiento
    updateUserToken: async (userId, { resetToken, resetTokenExpires }) => {
        try {
            const token = await User.findByIdAndUpdate(userId, { resetToken, resetTokenExpires }, { new: true });
            return token;
        } catch (error) {
            logger.error(`Error al actualizar el token de restablecimiento: ${error.message}`);
            throw new Error("Error al actualizar el token de restablecimiento: " + error.message);
        }
    },

    // Método para actualizar la contraseña del usuario
    updateUserPassword: async (userId, hashedPassword) => {
        try {
            const updatePassword = await User.findByIdAndUpdate(
                userId, 
                { password: hashedPassword }, 
                { new: true }
            );
            await updatePassword.save();
            return updatePassword;
        } catch (error) {
            logger.error(`Error al actualizar la contraseña del usuario: ${error.message}`);
            throw new Error("Error al actualizar la contraseña del usuario: " + error.message);
        }
    },

    // Método para subir los documentos
    uploadDocs: async (userId, documents) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }

            documents.forEach(doc => {
                user.documents.push({
                    name: doc.originalname,
                    reference: doc.path
                });
            });

            await user.save();
            return user.documents;
        } catch (error) {
            throw new Error("Error al subir documentos: " + error.message);
        }
    },

    // Método para buscar los documentos del usuario
    getDocsByUser: async (userId) => {
        try {
            const user = await User.findById(userId).select('documents');

            if (!user || user.documents.length === 0) {
                throw new Error("No se ha encontrado ningún documento");
            }

            return user;
        } catch (error) {
            throw new Error("Error buscar los documentos del usuario: " + error.message);
        }
    },

    // Método para borrar el usuario por su ID
    deleteUser: async (userId) => {
        try {   
            const deleteUser = await User.findByIdAndDelete({ _id: userId });

            if(!deleteUser) {
                throw new Error("Usuario no existente"); 
            }

            return deleteUser;
        } catch (error) {
            throw new Error("Error al eliminar el usuario: " + error.message);
        }
    },

    // Método para actualizar el usuario
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