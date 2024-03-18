import express from "express";
import mongoose from "mongoose";
import http from "http";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import __dirname from "./util.js";
import path from "path";
import router from "./routes.js";

const app = express();
const httpServer = http.createServer(app);

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Rutas para productos y carritos
//app.use("/api/products", productRouter);
//app.use("/api/carts", cartRouter);

mongoose.connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

// Middleware adicional para analizar el cuerpo de la solicitud JSON en cartRouter
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// Middleware para utilizar plantillas html
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", router);

const PORT = 8080;

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log("Servidor conectado!!");
});

// Servidor WebSocket
const io = new Server(httpServer);

io.on('connection', socket => {
    console.log("Nuevo cliente conectado!!");

    socket.on("deleteProduct", (deleteProduct) => {
        console.log("Producto borrado:", deleteProduct);
        io.emit("deleteProduct", deleteProduct);
    });

    socket.on("addProduct", (addProduct) => {
        console.log("Producto agregado:", addProduct);
        io.emit("addProduct", addProduct);
    });

    socket.on("addMessage", (addMessage) => {
        console.log("Mensaje agregado");
        io.emit("addMessage", addMessage);
    })
})