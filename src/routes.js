import express from "express";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import messageRouter from "./routes/message.router.js";

const router = express.Router();

router.use("/cart", cartRouter);
router.use("/products", productRouter);
router.use("/messages", messageRouter);

export default router;