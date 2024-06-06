import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAuthToken } from "../../config/auth.js";
import passport from "passport";
import userRepository from "../repositories/user.repository.js";
import UserDTO from "../DTO/user.dto.js";
import logger from "../../utils/logger.js";

const userService = {
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

    getLogin: async () => {
        return "login";
    },

    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            passport.authenticate("local", (err, user, info) => {
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

                const access_token = generateAuthToken(user);
                logger.info(`User iniciado sesión exitosamente: ${email}`);
                resolve({ user, access_token });
            })({ body: { email, password } }, {});
        });
    },

    getRegister: async () => {
        return "register";
    },

    register: async (userData) => {
        const { first_name, last_name, email, age, password } = userData;
        try {
            logger.info(`Registrando nuevo user: ${email}`);
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                logger.warn(`User ya exite: ${email}`);
                throw new Error("El usuario ya existe");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserDTO = new UserDTO(first_name, last_name, email, age, hashedPassword);
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

    getGitHub: async () => {
        return passport.authenticate("github", { scope: ["user:email"] });
    },

    gitHubCallback: async () => {
        return passport.authenticate("github", { failureRedirect: "/login" });
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
            await userRepository.updateUser(userId, { resetToken, resetTokenExpires });
        } catch (error) {
            logger.error(`Error al guardar el token de restablecimiento: ${error.message}`);
            throw new Error("Error al guardar el token de restablecimiento: " + error.message);
        }
    },

    getUserByResetToken: async (token) => {
        try {
            const user = await userRepository.findByResetToken(token);
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
            await userRepository.updateUser(userId, { password: hashedPassword });
        } catch (error) {
            logger.error(`Error al actualizar la contraseña del usuario: ${userId} - ${error.message}`);
            throw new Error("Error al actualizar la contraseña del usuario: " + error.message);
        }
    },

    clearPasswordResetToken: async (userId) => {
        try {
            await userRepository.updateUser(userId, { resetToken: null, resetTokenExpires: null });
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

    changeUserRole: async (userId, newRole) => {
        try {
            const user = await userRepository.findUser(userId);
            if (!user) {
                throw new Error("El usuario no existe");
            }
            user.role = newRole;
            await user.save();
            return user;
        } catch (error) {
            throw new Error("Error al cambiar el rol del usuario: " + error.message);
        }
    },    

    getChangeUserRole: async () => {
        return "changeUserRole";
    },

    logOut: async (res, req) => {
        try {
            logger.info(`Logging out user: ${req.session.userId}`);
            req.session.userId = null;
            req.session.user = null;
            req.session.isAuthenticated = false;
            res.clearCookie("jwtToken");
            logger.info(`User logged out exitosamente: ${req.session.userId}`);
            return { message: "Logout funciona" };
        } catch (error) {
            logger.error(`Error logging out user: ${req.session.userId} - ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    }
}

export default userService;