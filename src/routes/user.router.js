import express from "express";
import userController from "../dao/controllers/user.controller.js";

const userRouter = express.Router();

// Maneja el renderizado del login
userRouter.get("/login", userController.getLogin);

// Maneja el renderizado del register
userRouter.get("/register", userController.getRegister);

// Maneja la solicitud de login de usuarios
userRouter.post("/login", userController.login);

// Maneja la solicitud de registros de usuarios
userRouter.post("/register", userController.register);

/*
// Maneja la solicitud para entrar al dashboard del usuario
userRouter.get("/:uid", userController.getUserById);
*/

// Maneja la solicitud para cerrar la sesion del usuario
userRouter.get("/logout", userController.logOut);

export default userRouter;