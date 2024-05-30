import bcrypt from "bcrypt";
import { generateAuthToken } from "../../config/auth.js";
import passport from "passport";
import userRepository from "../repositories/user.repository.js";
import UserDTO from "../DTO/user.dto.js";
import logger from "../../utils/logger.js";

const userService = {
    getUserById: async (userId) => {
        try {
            logger.info(`Fetching user by ID: ${userId}`);
            const user = await userRepository.findById(userId, true);
            logger.info(`User fetched successfully: ${userId}`);
            return user;
        } catch (error) {
            logger.error(`Error fetching user by ID: ${userId} - ${error.message}`);
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
                    logger.error(`Error during login authentication: ${err.message}`);
                    return reject(err);
                }
                if (!user) {
                    logger.warn(`Invalid login credentials for email: ${email}`);
                    return reject(new Error("Credenciales inválidas"));
                }
                if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
                    user.role = "admin";
                }

                const access_token = generateAuthToken(user);
                logger.info(`User logged in successfully: ${email}`);
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
            logger.info(`Registering new user: ${email}`);
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                logger.warn(`User already exists: ${email}`);
                throw new Error("El usuario ya existe");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserDTO = new UserDTO(first_name, last_name, email, age, hashedPassword);
            const newUser = { ...newUserDTO };
            const createdUser = await userRepository.createUser(newUser);
            const access_token = generateAuthToken(createdUser);

            logger.info(`User registered successfully: ${email}`);
            return { newUser: createdUser, access_token };
        } catch (error) {
            logger.error(`Error registering user: ${email} - ${error.message}`);
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
            logger.info(`Handling GitHub callback for user: ${user.email}`);
            const access_token = generateAuthToken(user);
            logger.info(`GitHub callback handled successfully for user: ${user.email}`);
            return { user, access_token };
        } catch (error) {
            logger.error(`Error in GitHub callback for user: ${user.email} - ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    },

    updateUser: async (userId, updatedUserData) => {
        try {
            logger.info(`Updating user: ${userId}`);
            const existingUser = await userRepository.findUser(userId);
            if (!existingUser) {
                logger.warn(`User not found: ${userId}`);
                throw new Error("El usuario no existe");
            }

            existingUser.first_name = updatedUserData.first_name || existingUser.first_name;
            existingUser.last_name = updatedUserData.last_name || existingUser.last_name;
            existingUser.email = updatedUserData.email || existingUser.email;

            await existingUser.save();
            logger.info(`User updated successfully: ${userId}`);
            return existingUser;
        } catch (error) {
            logger.error(`Error updating user: ${userId} - ${error.message}`);
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    },

    getUpdateUser: async () => {
        return "updateUser";
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            logger.info(`Changing password for user: ${userId}`);
            const existingUser = await userRepository.findUser(userId);
            if (!existingUser) {
                logger.warn(`User not found: ${userId}`);
                throw new Error("El usuario no existe");
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordValid) {
                logger.warn(`Invalid old password for user: ${userId}`);
                throw new Error("La contraseña antigua es incorrecta");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingUser.password = hashedPassword;

            await existingUser.save();
            logger.info(`Password changed successfully for user: ${userId}`);
            return { message: "Contraseña actualizada correctamente" };
        } catch (error) {
            logger.error(`Error changing password for user: ${userId} - ${error.message}`);
            throw new Error("Error al cambiar la contraseña: " + error.message);
        }
    },

    getChangePassword: async () => {
        return "changePassword";
    },

    logOut: async (res, req) => {
        try {
            logger.info(`Logging out user: ${req.session.userId}`);
            req.session.userId = null;
            req.session.user = null;
            req.session.isAuthenticated = false;
            res.clearCookie("jwtToken");
            logger.info(`User logged out successfully: ${req.session.userId}`);
            return { message: "Logout funciona" };
        } catch (error) {
            logger.error(`Error logging out user: ${req.session.userId} - ${error.message}`);
            throw new Error("Error interno del servidor");
        }
    }
}

export default userService;