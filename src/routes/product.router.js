import express from "express"
import { configureProductMulter } from "../util.js";
import productController from "../dao/controllers/product.controller.js";

const productRouter = express.Router();
const imgUpload = configureProductMulter();


// Ruta para renderizar la vista de productos en tiempo real
productRouter.get("/realtimeproducts", productController.getProducts);

// Maneja la solicitud para ver el producto en tiempo real
productRouter.get("/realtimeproducts/product/:id", productController.getProductDetail);

// Maneja la solicitud de ver los mensajes del producto en tiempo real
productRouter.get("/realtimeproducts/message/:id", productController.getMessagesByProduct);

// Maneja la solicitud de ver los productos de una categoria en tiempo real
productRouter.get("/realtimeproducts/:category", productController.getProductsByCategory);

// Manejar la solicitud de agregar un producto en tiempo real
productRouter.post("/realtimeproducts/addProduct", imgUpload.single("image"), productController.addProduct);

// Manejar la solicitud de editar un producto en tiempo real
productRouter.put("/realTimeProducts/editProduct/:id", imgUpload.single("image"), productController.updateProduct)

// Manejar la solicitud de eliminación de un producto en tiempo real
productRouter.delete('/realtimeproducts/deleteProduct/:id', productController.deleteProduct);

export default productRouter;