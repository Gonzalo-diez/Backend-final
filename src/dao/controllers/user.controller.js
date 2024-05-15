import userService from "../services/user.service.js";

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