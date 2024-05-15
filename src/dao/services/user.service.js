import bcrypt from "bcrypt";
import { generateAuthToken } from "../../config/auth.js";
import passport from "passport";
import userRepository from "../Repositories/user.repository.js";
import UserDTO from "../DTO/user.dto.js";

const userService = {
    getUserById: async (userId) => {
        try {
            const user = await userRepository.findById(userId, true);
            return user;
        } catch (error) {
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
                    reject(err);
                }
                if (!user) {
                    reject(new Error("Credenciales inválidas"));
                }
                if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
                    user.role = "admin";
                }

                // Generar token JWT
                const access_token = generateAuthToken(user);

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
            // Verificar si el usuario ya existe
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error("El usuario ya existe");
            }

            // Realiza el hash de la contraseña usando bcrypt para encriptarla en la base de datos
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear un nuevo usuario utilizando el DTO
            const newUserDTO = new UserDTO(first_name, last_name, email, age, hashedPassword);

            // Convertir el DTO a un objeto plano
            const newUser = { ...newUserDTO };

            const createdUser = await userRepository.createUser(newUser);

            // Genera el token de acceso
            const access_token = generateAuthToken(createdUser);

            return { newUser: createdUser, access_token };
        } catch (error) {
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
            // Genera el token de acceso
            const access_token = generateAuthToken(user);
            return { user, access_token };
        } catch (error) {
            console.error('Error en el callback de GitHub:', error);
            throw new Error("Error interno del servidor");
        }
    },

    updateUser: async (userId, updatedUserData) => {
        try {
            // Verificar si el usuario existe
            const existingUser = await userRepository.findById(userId);
            if (!existingUser) {
                throw new Error("El usuario no existe");
            }

            // Actualizar los campos del usuario con los datos del DTO
            existingUser.first_name = updatedUserData.first_name || existingUser.first_name;
            existingUser.last_name = updatedUserData.last_name || existingUser.last_name;
            existingUser.email = updatedUserData.email || existingUser.email;

            // Guardar los cambios en la base de datos
            await existingUser.save();

            return existingUser;
        } catch (error) {
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    },

    getUpdateUser: async () => {
        return "updateUser";
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            // Verificar si el usuario existe
            const existingUser = await userRepository.findById(userId);
            if (!existingUser) {
                throw new Error("El usuario no existe");
            }

            // Verificar si la contraseña antigua coincide
            const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordValid) {
                throw new Error("La contraseña antigua es incorrecta");
            }

            // Realizar el hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Actualizar la contraseña del usuario
            existingUser.password = hashedPassword;

            // Guardar los cambios en la base de datos
            await existingUser.save();

            return { message: "Contraseña actualizada correctamente" };
        } catch (error) {
            throw new Error("Error al cambiar la contraseña: " + error.message);
        }
    },

    getChangePassword: async () => {
        return "changePassword";
    },

    logOut: async (res, req) => {
        try {
            // Cierra la sesión del usuario
            req.session.userId = null;
            req.session.user = null;
            req.session.isAuthenticated = false;
            res.clearCookie("jwtToken");
            return { message: "Logout funciona" };
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            throw new Error("Error interno del servidor");
        }
    }
}

export default userService;