import express from "express"
import { configureProductMulter } from "../util.js";
import productController from "../controllers/product.controller.js";
import { authToken, isAdmin, isPremium, isPremiumOrAdmin } from "../config/auth.js";

const productRouter = express.Router();
const imgUpload = configureProductMulter();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Ruta para renderizar la vista de productos en tiempo real
productRouter.get("/", productController.getProducts);

// Maneja la solicitud para ver los detalles del producto
productRouter.get("/:pid", productController.getProductDetail);

// Maneja la solicitud para ver las categorias de los productos
productRouter.get("/category/:category", productController.getProductCategory);

// Maneja la solicitud para renderizar el formulario para editar el producto
productRouter.get("/updateProduct/:pid", authToken, isPremiumOrAdmin, productController.getUpdateProduct);

// Manejar la solicitud para agregar un producto en tiempo real
productRouter.post("/", authToken, isPremiumOrAdmin, imgUpload.single("image"), productController.addProduct);

// Maneja la solicitud para actualizar el producto
productRouter.put("/:pid", authToken, isPremiumOrAdmin, imgUpload.single("image"), productController.updateProduct);

// Manejar la solicitud para la eliminación de un producto en tiempo real
productRouter.delete('/:pid', authToken, isPremiumOrAdmin, productController.deleteProduct);

export default productRouter;