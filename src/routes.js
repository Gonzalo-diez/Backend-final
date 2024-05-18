import express from "express";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import messageRouter from "./routes/message.router.js";
import userRouter from "./routes/user.router.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.render("home");
});

router.use("/api/carts", cartRouter);
router.use("/api/products", productRouter);
router.use("/api/messages", messageRouter);
router.use("/api/sessions", userRouter);

export default router;