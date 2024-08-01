import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import { EMAIL_USERNAME, transport } from "../util.js";
import userService from "../dao/services/user.service.js";

const userController = {
    getUsers: async (req, res) => {
        let currentPage = req.query.page || 1;
        const userId = req.session.userId;
        const user = req.session.user;
        const jwtToken = req.session.token;
        const userRole = req.session.userRole;

        try {
            // Se encarga de traer la lista de usuarios
            const response = await userService.getUsers(currentPage);

            if (req.accepts("html")) {
                return res.render("usersList", { response, userId, user, jwtToken, userRole });
            }
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getUserById: async (req, res) => {
        const userId = req.params.uid;
        let currentPage = req.query.page || 1;
        const isAuthenticated = req.session;
        const jwtToken = req.session.token;

        try {
            // Se en carga de buscar el id del admin y traer la lista de usuarios
            const user = await userService.getUserById(userId);

            const response = await userService.getUsers(currentPage);

            if (req.accepts("html")) {
                return res.render("user", { User: user, user, response, isAuthenticated, jwtToken });
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
        const file = req.file;

        try {
            const { newUser, access_token } = await userService.register(userData, file);

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

    getGitHub: (req, res, next) => {
        passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
    },
    
    gitHubCallback: (req, res, next) => {
        passport.authenticate("github", { failureRedirect: "/login" })(req, res, next);
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
            // Se encarga de actualizar el usuario, usando el ID y los datos como parámetros
            const updatedUser = await userService.updateUser(userId, updatedUserData);
            res.json(updatedUser);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getUpdateUser: async (req, res) => {
        const user = req.session.user;
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
            // Busca el usuario por su email y se le envie un mensaje a su email para cambiar la contraseña de la cuenta
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

        try {
            // Busca el reset token del usuario para verificar que se le haya mandado el mensaje y asi autorizar el cambio de contraseña
            const user = await userService.getUserByResetToken(token);

            if (!user || user.resetTokenExpires < Date.now()) {
                return res.status(400).json({ error: "Token de restablecimiento inválido o expirado" });
            }

            await userService.updatePassword(user._id, newPassword);
            await userService.clearPasswordResetToken(user._id);

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
            // Se encarga cambiar la contraseña del usuario, verificando que la contraseña antigua sea la correcta
            const changedPassword = await userService.changePassword(userId, oldPassword, newPassword);
            res.json(changedPassword);
        }
        catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getChangePassword: async (req, res) => {
        const isAuthenticated = req.session;
        const jwtToken = req.session.token;

        try {
            const changePasswordView = await userService.getChangePassword();
            res.render(changePasswordView, { isAuthenticated, jwtToken });
        } catch (error) {
            console.error("Error al obtener la vista de cambiar contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    changePremiumRole: async (req, res) => {
        const userId = req.params.uid;
        const files = req.files;
    
        try {
            // Se encarga de cambiar el rol de user a premium
            const updatedPremium = await userService.changePremiumRole(userId, files);
            res.json(updatedPremium);
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },    
    
    getChangePremiumRole: async (req, res) => {
        const userId = req.params.uid;
        const user = req.session.user;
        const jwtToken = req.session.token;

        try {
            const changeUserRoleView = await userService.getChangePremiumRole();
            res.render(changeUserRoleView, { user, jwtToken, userId })
        } catch (error) {
            console.error("Error al obtener la vista de cambio de role:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    changeUserRole: async (req, res) => {
        const userId = req.params.uid;

        try {
            // Se encarga de cambiar el rol de premium a user
            const updatedUser = await userService.changeUserRole(userId);
            res.json(updatedUser);
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getChangeUserRole: async (req, res) => {
        const user = req.session.user.user;
        const isAuthenticated = req.session.isAuthenticated;
        const jwtToken = req.session.token;
        const userId = req.params.uid;

        try {
            const changePremiumRoleView = await userService.getChangeUserRole();
            res.render(changePremiumRoleView, { user, isAuthenticated, jwtToken, userId })
        } catch (error) {
            console.error("Error al obtener la vista de cambio de role:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    
    getUploadDocs: async (req, res) => {
        const userId = req.params.uid;
        const isAuthenticated = req.session;
        const jwtToken = req.session.token;

        try {
            const user = await userService.getUserById(userId);
            const uploadDocsView = await userService.getUplaodDocs();
            res.render(uploadDocsView, { user, isAuthenticated, jwtToken });
        } catch (error) {
            console.error("Error al obtener la vista de subida de documentos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    uploadDocs: async (req, res) => {
        const userId = req.params.uid;
        const files = req.files;

        try {
            // Se encarga de guardar los documentos que el usuario suba a la plataforma
            const uploadedDocs = await userService.uploadDocs(userId, files);
            res.json(uploadedDocs);
        }
        catch (error) {
            console.error("Error al subir los documents:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getDocsByUser: async (req, res) => {
        const userId = req.params.uid;
        const isAuthenticated = req.session;
        const jwtToken = req.session.token;

        try {
            // Trae la lista de los documentos subidos del usuario
            const getDocs = await userService.getDocsByUser(userId);

            if (req.accepts('html')) {
                return res.render('docs', { Docs: getDocs, isAuthenticated, jwtToken });
            }
        } catch (error) {
            console.error("Error al obtener la vista de ver los documentos del user:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    deleteInactiveUser: async (req, res) => {
        try {
            // Variable para eliminar los usuarios que tengan 2 dias seguidos sin conectarse
            const inactivityPeriod = 2 * 24 * 60 * 60 * 1000;

            /* Se encarga de buscar a los usuarios que cumplan con el parámetro de inactividad 
            y enviar el mensaje de usuario eliminado por inactividad */
            const user = await userService.findInactiveUser(inactivityPeriod);

            if (user.role == "admin") {
                return res.status(404).json({ error: "No se puede eliminar el administrador" });
            }

            // Elimina a los usuarios inactivos
            const deleteInactiveUser = await userService.deleteInactiveUser(user._id);

            if (!deleteInactiveUser) {
                return res.status(404).json({ error: "No se ha podido eliminar el usuario inactivo" });
            }

            const mailOptions = {
                to: user.email,
                from: EMAIL_USERNAME,
                subject: 'Se le ha eliminado su cuenta por inactividad',
                text: `Está recibiendo este mensaje porque usted no se ha conectado en 2 dias seguidos y su cuenta ha sido eliminada por inactividad.`
            };

            await transport.sendMail(mailOptions);

            res.status(200).json({ message: 'Correo de aviso de eliminación de usuario enviado con éxito' });
        } catch (error) {
            console.error("Error al eliminar el usuario por inactividad:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    adminChangeUserRole: async (req, res) => {
        const userId = req.params.uid;

        try {
            // Se encarga de ser una herramienta para el adminstrador para cambiar los roles de los usuarios
            const changeUserRole = await userService.adminChangeUserRole(userId);

            if (!changeUserRole) {
                return res.status(404).json({ error: "No se ha podido cambiar el rol del usuario" })
            }

            res.status(200).json({ message: 'Cambio del rol exitoso' });
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.params.uid;

        try {
            // Se encarga de ser una herramienta para el administrador para borrar el usuario por su ID
            const deleteUser = await userService.deleteUser(userId);

            if (!deleteUser) {
                return res.status(404).json({ error: "No se ha podido eliminar el usuario" });
            }

            res.status(200).json({ message: 'Eliminación del usuario con exito' });
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    logOut: async (req, res) => {
        const userId = req.session.userId;

        try {
            // Se encarga de cerrar la sesión del usuario
            await userService.logOut(res, userId);
            req.session.userId = null;
            req.session.user = null;
            req.session.isAuthenticated = false;
            return res.json({ message: "Logout funciona" });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default userController;