import express from "express";
import { configureDocumentMulter, configureProfileMulter } from "../util.js";
import userController from "../controllers/user.controller.js";
import { authToken, isAdmin, isPremium, isUser, isAll } from "../config/auth.js";

const userRouter = express.Router();
const profileUpload = configureProfileMulter();
const documentUpload = configureDocumentMulter();
const getPremium = documentUpload.fields([
    {name: "identificacion", maxCount: 1},
    {name: "comprobanteDomicilio", maxCount: 1},
    {name: "comprobanteCuenta", maxCount: 1}
]);

// Maneja la solicitud de mostrar la lista de usuarios
userRouter.get("/", authToken, isAdmin, userController.getUsers);

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

// Maneja el renderizado del change role de usuario a premium
userRouter.get("/premium/:uid", authToken, isUser, userController.getChangePremiumRole);

// Maneja el renderizado del change role de usuario a user
userRouter.get("/user/:uid", authToken, isPremium, userController.getChangeUserRole);

// Maneja el renderizado de la subida de documentos
userRouter.get("/:uid/uploadDocuments", authToken, isAll, userController.getUploadDocs);

// Maneja la vista de los documentos del usuario
userRouter.get("/:uid/documents", authToken, userController.getDocsByUser);

// Maneja la solicitud para actualizar los datos del usuario
userRouter.put("/updateUser/:uid", authToken, userController.updateUser);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.put("/changePassword/:uid", authToken, userController.changePassword);

// Maneja la solicitud para cambiar el rol del usuario a premium
userRouter.put("/premium/:uid", authToken, isUser, getPremium, userController.changePremiumRole);

// Maneja la solicitud para cambiar el rol del usuario a user
userRouter.put("/user/:uid", authToken, isPremium, userController.changeUserRole);

// Maneja la solicitud para cambiar los roles de los usuarios en la dashboard del admin
userRouter.put("/changeRole/:uid", authToken, isAdmin, userController.adminChangeUserRole);

// Maneja la solicitud de login de usuarios
userRouter.post("/login", userController.login);

// Maneja la solicitud de registros de usuarios
userRouter.post("/register", profileUpload.single("profile"), userController.register);

// Maneja la solicitud para enviar los mensajes para cambiar la contraseña
userRouter.post("/requestPasswordReset", userController.requestPasswordReset);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.post("/resetPassword/:token", userController.resetPassword);

// Maneja la solicitud para subir documentos
userRouter.post("/:uid/uploadDocuments", authToken, isAll, documentUpload.array("documents", 10), userController.uploadDocs);

// Maneja la solicitud de eliminar los usuarios inactivos
userRouter.delete("/", userController.deleteInactiveUser);

// Maneja la solicitud de eliminar los usuarios por su id
userRouter.delete("/:uid", authToken, isAdmin, userController.deleteUser);

export default userRouter;