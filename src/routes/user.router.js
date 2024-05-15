import express from "express";
import userController from "../dao/controllers/user.controller.js";
import { authToken, isAdmin } from "../config/auth.js";

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

// Maneja la solicitud de buscar los productos vendidos del usuario
userRouter.get("/soldProducts/:uid", authToken, userController.soldProducts);

// Maneja la solicitud de buscar los productos comprados por el usuario
userRouter.get("/boughtProducts/:uid", authToken, userController.boughtProducts);

// Maneja la solicitud de buscar los productos creados por el usuario
userRouter.get("/createdProducts/:uid", authToken, userController.getUserProducts);

// Maneja la solicitud para actualizar los datos del usuario
userRouter.put("/updateUser/:uid", authToken, userController.updateUser);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.put("/changePassword/:uid", authToken, userController.changePassword);

// Maneja la solicitud de login de usuarios
userRouter.post("/login", userController.login);

// Maneja la solicitud de registros de usuarios
userRouter.post("/register", userController.register);

export default userRouter;