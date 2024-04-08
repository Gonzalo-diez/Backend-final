import express from "express";
import mongoose from "mongoose";
import http from "http";
import Handlebars from "handlebars";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import __dirname from "./util.js";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import router from "./routes.js";

Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

const fileStore = FileStore(session);
const app = express();
const httpServer = http.createServer(app);

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Middleware para utilizar cookies
app.use(cookieParser());

// Middleware para usar el session para autenticaciones de usuarios
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://gonza:Coder2001@ecommerce.salixhx.mongodb.net/`,
        ttl: 15,
    }),
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
}))

// Rutas para productos y carritos
//app.use("/api/products", productRouter);
//app.use("/api/carts", cartRouter);

mongoose.connect(`mongodb+srv://gonza:Coder2001@ecommerce.salixhx.mongodb.net/`, {
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
app.use("/api/", router);

const PORT = 8080;

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log("Servidor conectado!!");
});

// Servidor WebSocket
const io = new Server(httpServer);

io.on('connection', socket => {
    console.log("Nuevo cliente conectado!!");

    socket.on("deleteProduct", (deleteProductId) => {
        console.log("Producto borrado:", deleteProductId);
        io.emit("deleteProduct", deleteProductId);
    });

    socket.on("addProduct", (addProduct) => {
        console.log("Producto agregado:", addProduct);
        io.emit("addProduct", addProduct);
    });

    socket.on("addMessage", (addMessage) => {
        console.log("Mensaje agregado", addMessage);
        io.emit("addMessage", addMessage);
    });

    socket.on("deleteProductCart", (deleteProductCartId) => {
        console.log("Producto eliminado del carrito", deleteProductCartId);
        io.emit("deleteProductCart", deleteProductCartId);
    });

    socket.on("clearCart", (clearCart) => {
        console.log("Carrito vaciado:", clearCart);
        io.emit("clearCart", clearCart);
    });
});