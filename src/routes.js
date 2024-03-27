import express from "express";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import messageRouter from "./routes/message.router.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.render("home");
});

router.use("/carts", cartRouter);
router.use("/products", productRouter);
router.use("/messages", messageRouter);

export default router;