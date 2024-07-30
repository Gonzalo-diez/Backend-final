import User from "../models/user.model.js";

const userRepository = {
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

    findInactiveUser: async (inactivityPeriod) => {
        const inactivityDate = new Date(Date.now() - inactivityPeriod);
        try {
            const user = await User.findOne({ last_connection: { $lt: inactivityDate } });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuarios inactivos: " + error.message);
        }
    },

    deleteInactiveUser: async (userId) => {
        try {
            const deleteInactiveUser = await User.deleteOne({ _id: userId });
            return deleteInactiveUser;
        } catch (error) {
            throw new Error("Error al eliminar el usuario inactivo: " + error.message);
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