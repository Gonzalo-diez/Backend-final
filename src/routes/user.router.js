import express from "express";
import userController from "../controllers/user.controller.js";
import { authToken, isAdmin, isPremium, isUser, isUserOrPremium } from "../config/auth.js";

const userRouter = express.Router();

// Maneja la solicitud para buscar el usuario por id y ver el dashboard
userRouter.get("/dashboard/:uid", authToken, isAdmin, userController.getUserById);

// Maneja la solicitud para ver el formulario para editar el usuario
userRouter.get("/updateUser/:uid", authToken, userController.getUpdateUser);

// Maneja la solicitud para ver el formulario para cambiar la contraseña
userRouter.get("/changePassword/:uid", authToken, userController.getChangePassword);

// Maneja la solicitud para cerrar la sesión del usuario
userRouter.get("/logout", authToken, userController.logOut);

// Maneja el renderizado del login
userRouter.get("/login", userController.getLogin);

// Maneja el renderizado del register
userRouter.get("/register", userController.getRegister);

// Iniciar sesión con GitHub
userRouter.get("/github", userController.getGitHub);

// Callback de GitHub después de la autenticación
userRouter.get("/githubcallback", userController.gitHubCallback, userController.handleGitHubCallback);

// Maneja el renderizado del forgot password
userRouter.get("/forgotPassword", userController.getForgotPassword);

// Maneja el renderizado del reset password
userRouter.get("/resetPassword/:token", userController.getResetPassword);

// Maneja el renderizado del change role
userRouter.get("/premium/:uid", authToken, isUserOrPremium, userController.getChangeUserRole);

// Maneja la solicitud para actualizar los datos del usuario
userRouter.put("/updateUser/:uid", authToken, userController.updateUser);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.put("/changePassword/:uid", authToken, userController.changePassword);

// Maneja la solicitud para cambiar el rol del usuario
userRouter.put("/premium/:uid", authToken, isUserOrPremium, userController.changeUserRole);

// Maneja la solicitud de login de usuarios
userRouter.post("/login", userController.login);

// Maneja la solicitud de registros de usuarios
userRouter.post("/register", userController.register);

// Maneja la solicitud para enviar los mensajes para cambiar la contraseña
userRouter.post("/requestPasswordReset", userController.requestPasswordReset);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.post("/resetPassword/:token", userController.resetPassword);

export default userRouter;