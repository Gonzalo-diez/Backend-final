import crypto from "crypto";
import nodemailer from "nodemailer";
import { EMAIL_USERNAME } from "../util.js";
import userService from "../dao/services/user.service.js";
import { transport } from "../app.js";

const userController = {
    getUserById: async (req, res) => {
        const userId = req.params.uid;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const user = await userService.getUserById(userId);

            if (req.accepts("html")) {
                return res.render("user", { User: user, user, isAuthenticated, jwtToken });
            }
        } catch (error) {
            console.error("Error al obtener usuario por ID:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getLogin: async (req, res) => {
        try {
            const loginView = await userService.getLogin();
            res.render(loginView);
        } catch (error) {
            console.error("Error al obtener la vista de inicio de sesión:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    login: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const { user, access_token } = await userService.login(email, password);

            // Establece la sesión del usuario
            req.session.token = access_token;
            req.session.userId = user._id;
            req.session.user = user;
            req.session.isAuthenticated = true;
            req.session.userRole = user.role;

            console.log("Datos del login:", user, "token:", access_token);

            res.cookie("jwtToken", access_token, {
                httpOnly: true,
            }).send({ status: "Success", message: user, access_token, userId: user._id, userRole: user.role });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getRegister: async (req, res) => {
        try {
            const registerView = await userService.getRegister();
            res.render(registerView);
        } catch (error) {
            console.error("Error al obtener la vista de registro:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    register: async (req, res, next) => {
        const userData = req.body;

        try {
            const { newUser, access_token } = await userService.register(userData);

            // Establece la sesión del usuario
            req.session.token = access_token;
            req.session.userId = newUser._id;
            req.session.user = newUser;
            req.session.isAuthenticated = true;
            req.session.userRole = newUser.role;

            console.log("Datos del registro:", newUser, "token:", access_token);

            res.cookie("jwtToken", access_token, {
                httpOnly: true,
            }).send({ status: "Success", message: newUser, access_token, userId: newUser._id, userRole: newUser.role });

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            next(error);
        }
    },

    getGitHub: async (req, res) => {
        try {
            const githubAuth = await userService.getGitHub();
            res.redirect(githubAuth);
        } catch (error) {
            console.error("Error al obtener la autenticación de GitHub:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    gitHubCallback: async (req, res, next) => {
        try {
            await userService.gitHubCallback()(req, res, next);
        } catch (error) {
            console.error("Error en el callback de GitHub:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    handleGitHubCallback: async (req, res) => {
        try {
            const { user, access_token } = await userService.handleGitHubCallback(req);

            // Establece la sesión del usuario
            req.session.token = access_token;
            req.session.userId = user._id;
            req.session.user = user;
            req.session.isAuthenticated = true;
            req.session.userRole = user.role;

            res.cookie("jwtToken", access_token, {
                httpOnly: true,
            }).send({ status: "Success", message: user, access_token, userId: user._id, userRole: user.role });
        } catch (error) {
            console.error('Error en el callback de GitHub:', error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    updateUser: async (req, res) => {
        const userId = req.params.uid;
        const updatedUserData = req.body;

        try {
            const updatedUser = await userService.updateUser(userId, updatedUserData);
            res.json(updatedUser);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getUpdateUser: async (req, res) => {
        const user = req.session.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const updateUserView = await userService.getUpdateUser();
            res.render(updateUserView, { isAuthenticated, jwtToken, user });
        } catch (error) {
            console.error("Error al obtener la vista de editar usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getForgotPassword: async (req, res) => {
        try {
            const forgotView = await userService.getForgotPassword();
            res.render(forgotView);
        } catch (error) {
            console.error("Error al obtener la vista de olvidar contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    requestPasswordReset: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpires = Date.now() + 3600000;

            await userService.savePasswordResetToken(user._id, resetToken, resetTokenExpires);

            const resetUrl = `http://${req.headers.host}/api/sessions/resetPassword/${resetToken}`;
            const mailOptions = {
                to: user.email,
                from: EMAIL_USERNAME,
                subject: 'Restablecimiento de contraseña',
                text: `Está recibiendo esto porque usted (o alguien más) ha solicitado el restablecimiento de la contraseña de su cuenta.\n\n
                Haga clic en el siguiente enlace, o péguelo en su navegador para completar el proceso:\n\n
                ${resetUrl}\n\n
                Si no solicitó esto, ignore este correo y su contraseña permanecerá sin cambios.\n`
            };

            await transport.sendMail(mailOptions);

            res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado con éxito' });
        } catch (error) {
            console.error("Error al solicitar restablecimiento de contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getResetPassword: async (req, res) => {
        const { token } = req.params;

        try {
            const resetPasswordView = await userService.getResetPassword();
            res.render(resetPasswordView);
        } catch (error) {
            console.error("Error al obtener la vista de reset contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    resetPassword: async (req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;
        const userId = req.session.userId;

        try {
            const user = await userService.getUserByResetToken(token);

            if (!user || user.resetTokenExpires < Date.now()) {
                return res.status(400).json({ error: "Token de restablecimiento inválido o expirado" });
            }

            await userService.updatePassword(userId, newPassword);
            await userService.clearPasswordResetToken(userId);

            res.status(200).json({ message: "Contraseña restablecida con éxito" });
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    changePassword: async (req, res) => {
        const userId = req.params.uid;
        const { oldPassword, newPassword } = req.body;

        try {
            const changedPassword = await userService.changePassword(userId, oldPassword, newPassword);
            res.json(changedPassword);
        }
        catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getChangePassword: async (req, res) => {
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;

        try {
            const changePasswordView = await userService.getChangePassword();
            res.render(changePasswordView, { isAuthenticated, jwtToken });
        } catch (error) {
            console.error("Error al obtener la vista de cambiar contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    changeUserRole: async (req, res) => {
        const userId = req.params.uid;
        const { newRole } = req.body;
    
        try {
            const updatedUser = await userService.changeUserRole(userId, newRole);
            res.json(updatedUser);
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },    
    
    getChangeUserRole: async (req, res) => {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);
        try {
            const changeUserRoleView = await userService.getChangeUserRole();
            res.render(changeUserRoleView, { user })
        } catch (error) {
            console.error("Error al obtener la vista de cambio de role:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    

    logOut: async (req, res) => {
        try {
            await userService.logOut(res, req);
            return res.json({ message: "Logout funciona" });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default userController;