import express from "express";
import userController from "../dao/controllers/user.controller.js";
import auth from "../config/auth.js";

const userRouter = express.Router();
const protectWithJWT = auth.authToken;

// Maneja el renderizado del login
userRouter.get("/login", userController.getLogin);

// Maneja el renderizado del register
userRouter.get("/register", userController.getRegister);

// Iniciar sesión con GitHub
userRouter.get("/github", userController.getGitHub);

// Callback de GitHub después de la autenticación
userRouter.get("/githubcallback", userController.gitHubCallback, userController.handleGitHubCallback);

// Maneja la solicitud de login de usuarios
userRouter.post("/login", userController.login);

// Maneja la solicitud de registros de usuarios
userRouter.post("/register", userController.register);

// Maneja la solicitud para cerrar la sesión del usuario
userRouter.get("/logout", protectWithJWT, userController.logOut);

export default userRouter;