import bcrypt from "bcrypt";
import { generateAuthToken } from "../../config/auth.js";
import passport from "passport";
import userRepository from "../repositories/user.repository.js";
import UserDTO from "../DTO/user.dto.js";
import logger from "../../utils/logger.js";

const userService = {
    getUsers: async (currentPage) => {
        try {
            const users = await userRepository.getUsers(currentPage);
            logger.info(`Usuarios encontrados: ${JSON.stringify(users)}`);
            return users;
        } catch (error) {
            logger.error("Error al obtener la lista de los usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getUserById: async (userId) => {
        try {
            logger.info(`Buscando user ID: ${userId}`);
            const user = await userRepository.findById(userId, true);
            logger.info(`User encontrado exitosamente: ${userId}`);
            return user;
        } catch (error) {
            logger.error(`Error al buscar el user ID: ${userId} - ${error.message}`);
            throw new Error("Error al obtener usuario por ID: " + error.message);
        }
    },

    findUser: async(userId) => {
        try {
            logger.info(`Buscando user ID: ${userId}`);
            const user = await userRepository.findUser(userId);
            logger.info(`User encontrado exitosamente: ${userId}`);
            return user;
        } catch (error) {
            logger.error(`Error al buscar el user ID: ${userId} - ${error.message}`);
            throw new Error("Error al obtener usuario por ID: " + error.message);
        }
    },

    getLogin: async () => {
        return "login";
    },

    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            passport.authenticate("local", async (err, user, info) => {
                if (err) {
                    logger.error(`Error durante la autenticacion del login: ${err.message}`);
                    return reject(err);
                }
                if (!user) {
                    logger.warn(`Credenciales de inicio de sesión no válidas para email: ${email}`);
                    return reject(new Error("Credenciales inválidas"));
                }
                if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
                    user.role = "admin";
                }

                // Actualizar el campo last_connection
                user.last_connection = new Date();
                await user.save();

                const access_token = generateAuthToken(user);
                logger.info(`User iniciado sesión exitosamente: ${email}`);
                resolve({ user, access_token });
            })({ body: { email, password } }, {});
        });
    },

    getRegister: async () => {
        return "register";
    },

    register: async (userData, file) => {
        const { first_name, last_name, email, age, password } = userData;
        try {
            logger.info(`Registrando nuevo user: ${email}`);
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                logger.warn(`User ya exite: ${email}`);
                throw new Error("El usuario ya existe");
            }

            const imageName = file ? file.filename : null;

            if (!imageName) {
                logger.warn(`Imagen invalida para el perfil del usuario: ${imageName}`);
                throw { code: 'INVALID_IMAGE' };
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserDTO = new UserDTO(first_name, last_name, email, age, hashedPassword, imageName);
            const newUser = { ...newUserDTO };
            const createdUser = await userRepository.createUser(newUser);
            const access_token = generateAuthToken(createdUser);

            logger.info(`User registrado: ${email}`);
            return { newUser: createdUser, access_token };
        } catch (error) {
            logger.error(`Error al registrar el user: ${email} - ${error.message}`);
            throw error;
        }
    },

    handleGitHubCallback: async (req) => {
        const user = req.user;
        try {
            logger.info(`Manejo de devolución de GitHub callback para user: ${user.email}`);
            const access_token = generateAuthToken(user);
            logger.info(`Devolución de GitHub callback manejada exitosamente para el user: ${user.email}`);
            return { user, access_token };
        } catch (error) {
            logger.error(`Error en GitHub callback del user: ${user.email} - ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    },

    updateUser: async (userId, updatedUserData) => {
        try {
            logger.info(`Actualizando user: ${userId}`);
            const existingUser = await userRepository.findUser(userId);
            if (!existingUser) {
                logger.warn(`User no encontrado: ${userId}`);
                throw new Error("El usuario no existe");
            }

            existingUser.first_name = updatedUserData.first_name || existingUser.first_name;
            existingUser.last_name = updatedUserData.last_name || existingUser.last_name;
            existingUser.email = updatedUserData.email || existingUser.email;

            await existingUser.save();
            logger.info(`User actualizado: ${userId}`);
            return existingUser;
        } catch (error) {
            logger.error(`Error al actualizar el user: ${userId} - ${error.message}`);
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    },

    getUpdateUser: async () => {
        return "updateUser";
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            logger.info(`Cambiando las contraseña del user: ${userId}`);
            const existingUser = await userRepository.findUser(userId);
            if (!existingUser) {
                logger.warn(`User no encontrado: ${userId}`);
                throw new Error("El usuario no existe");
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordValid) {
                logger.warn(`Contraseña antigua no válida para user: ${userId}`);
                throw new Error("La contraseña antigua es incorrecta");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingUser.password = hashedPassword;

            await existingUser.save();
            logger.info(`La contraseña cambió exitosamente para el user: ${userId}`);
            return { message: "Contraseña actualizada correctamente" };
        } catch (error) {
            logger.error(`Error al cambiar la contraseña para la user: ${userId} - ${error.message}`);
            throw new Error("Error al cambiar la contraseña: " + error.message);
        }
    },

    getChangePassword: async () => {
        return "changePassword";
    },

    getUserByEmail: async (email) => {
        try {
            const user = await userRepository.findByEmail(email);
            return user;
        } catch (error) {
            logger.error(`Error al buscar usuario por email: ${email} - ${error.message}`);
            throw new Error("Error al obtener usuario por email: " + error.message);
        }
    },

    savePasswordResetToken: async (userId, resetToken, resetTokenExpires) => {
        try {
            await userRepository.updateUserToken(userId, { resetToken, resetTokenExpires });
        } catch (error) {
            logger.error(`Error al guardar el token de restablecimiento: ${error.message}`);
            throw new Error("Error al guardar el token de restablecimiento: " + error.message);
        }
    },

    getUserByResetToken: async (token) => {
        try {
            const user = await userRepository.findByResetToken(token);
            logger.info(`Usuario encontrado: ${user}`);
            return user;
        } catch (error) {
            logger.error(`Error al buscar usuario por token de restablecimiento: ${token} - ${error.message}`);
            throw new Error("Error al obtener usuario por token de restablecimiento: " + error.message);
        }
    },

    updatePassword: async (userId, newPassword) => {
        try {
            if (!newPassword) {
                throw new Error("Nueva contraseña requerida")
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatePassword = await userRepository.updateUserPassword(userId, hashedPassword);
            logger.info(`Se ha cambiado la contraseña el user: ${userId}`)
            return updatePassword;
        } catch (error) {
            logger.error(`Error al actualizar la contraseña del usuario: ${userId} - ${error.message}`);
            throw new Error("Error al actualizar la contraseña del usuario: " + error.message);
        }
    },

    clearPasswordResetToken: async (userId) => {
        try {
            await userRepository.updateUserToken(userId, { resetToken: null, resetTokenExpires: null });
        } catch (error) {
            logger.error(`Error al limpiar el token de restablecimiento del usuario: ${userId} - ${error.message}`);
            throw new Error("Error al limpiar el token de restablecimiento del usuario: " + error.message);
        }
    },

    getForgotPassword: async () => {
        return "forgotPassword";
    },

    getResetPassword: async () => {
        return "resetPassword";
    },

    changePremiumRole: async (userId, files) => {
        try {
            const user = await userRepository.findUser(userId);
            if (!user) {
                throw new Error("El usuario no existe");
            }

            if (user.role === "user") {
                // Verificar si todos los archivos requeridos están presentes
                if (!files || !files.identificacion || !files.comprobanteDomicilio || !files.comprobanteCuenta) {
                    throw new Error("Se requiere la subida de documentación completa para cambiar el rol a premium");
                }

                // Procesar cada archivo de forma individual
                await userRepository.uploadDocs(userId, files.identificacion);
                await userRepository.uploadDocs(userId, files.comprobanteDomicilio);
                await userRepository.uploadDocs(userId, files.comprobanteCuenta);

                user.role = "premium"
            }

            else if (user.role === "premium") {
                user.role = "user"
            }

            // Guardar los cambios en la base de datos
            await user.save();
            return user;
        } catch (error) {
            throw new Error("Error al cambiar el rol del usuario: " + error.message);
        }
    },

    getChangePremiumRole: async () => {
        return "changePremiumRole";
    },

    changeUserRole: async (userId) => {
        try {
            const user = await userRepository.findUser(userId);
            if (!user) {
                throw new Error("El usuario no existe");
            }

            if (user.role === "premium") {
                user.role = "user"
            }

            else {
                logger.warn("Acceso no autorizado");
            }

            // Guardar los cambios en la base de datos
            await user.save();
            return user;
        } catch (error) {
            throw new Error("Error al cambiar el rol del usuario: " + error.message);
        }
    },

    getChangeUserRole: async () => {
        return "changeUserRole";
    },

    getUplaodDocs: async () => {
        return "uploadDocs";
    },

    uploadDocs: async (userId, files) => {
        try {
            logger.info(`Subiendo documentos para el usuario: ${userId}`);
            const documents = await userRepository.uploadDocs(userId, files);
            logger.info(`Documentos subidos exitosamente para el usuario: ${userId}`);
            return documents;
        } catch (error) {
            logger.error(`Error al subir documentos para el usuario: ${userId} - ${error.message}`);
            throw new Error("Error al subir documentos: " + error.message);
        }
    },

    getDocsByUser: async (userId) => {
        try {
            logger.info(`Buscando los documentos del usuario: ${userId}`);
            const docs = await userRepository.getDocsByUser(userId);
            logger.info(`Lista de documentos: ${docs}`);
            return docs;
        } catch (error) {
            logger.error(`Error al ver los documentos por usuario: ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    },

    findInactiveUser: async (inactivityPeriod) => {
        try {
            logger.info("Buscando usuarios inactivos");
            const user = await userRepository.findInactiveUser(inactivityPeriod);

            if (user == null) {
                logger.info("No se ha encontrado usuarios inactivos");
            } else if(user.role === "admin") {
                logger.info("No se puede eliminar el administrador");
            } else {
                logger.info(`Usuarios inactivos encontrados: ${user}`);
            }
            return user;
        } catch (error) {
            logger.error(`Error al buscar el usuario por inactividad: ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    },

    deleteInactiveUser: async (userId) => {
        try {
            logger.info(`Eliminando usuario por inactividad: ${userId}`);
            const deleteInactiveUser = await userRepository.deleteInactiveUser(userId);
            logger.info("usuario eliminado con exito");
            return deleteInactiveUser;
        } catch (error) {
            logger.error(`Error al buscar el usuario por inactividad: ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    },

    deleteUser: async (userId) => {
        try {
            logger.info(`Eliminando usuario: ${userId}`);
            const deleteUser = await userRepository.deleteUser(userId);
            logger.info("Usuario eliminado con exito");
            return deleteUser;
        } catch (error) {
            logger.error(`Error al eliminar el usuario: ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    },

    adminChangeUserRole: async (userId) => {
        try {
            const user = await userRepository.findUser(userId);
    
            logger.info(`Cambiando rol de usuario ${userId}, con rol ${user.role}`);
    
            if (!user) {
                throw new Error("El usuario no existe");
            }
    
            if (user.role === "premium") {
                user.role = "user";
            } else if (user.role === "user") {
                user.role = "premium";
            } else if (user.role === "admin") {
                logger.warn("No se puede cambiar el rol de admin")
            } else {
                logger.warn("Acceso no autorizado");
            }
    
            // Guardar los cambios en la base de datos
            await user.save();
            logger.info(`Cambio de rol de usuario exitoso: ${user.role}`);
            return user;
        } catch (error) {
            logger.error(`Error al cambiar el rol del usuario: ${userId}`);
            throw new Error("Error interno del servidor");
        }
    },    

    logOut: async (res, userId) => {
        try {
            await userRepository.updateUser(userId, { last_connection: new Date() });
            logger.info(`Logging out user: ${userId}`);
            res.clearCookie("jwtToken");
            logger.info(`User logged out exitosamente: ${userId}`);
            return { message: "Logout funciona" };
        } catch (error) {
            logger.error(`Error logging out user: ${userId} - ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    }
}

export default userService;