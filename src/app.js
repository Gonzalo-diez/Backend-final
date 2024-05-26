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
import cors from "cors";
import nodemailer from "nodemailer";
import compression from "express-compression";
import { fakerES as faker } from "@faker-js/faker";
import passport from "./config/jwt.js";
import router from "./routes.js";
import auth from "./config/auth.js";
import { MONGO_URL, EMAIL_USERNAME, EMAIL_PASSWORD } from "./util.js";
import errorHandler from "./errors/errorHandler.js";

Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

// Nodemailer
const dataTransport = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
}

const transport = nodemailer.createTransport(dataTransport);

const fileStore = FileStore(session);
const app = express();
const httpServer = http.createServer(app);

// Inicializar Passport
auth.initializePassport();

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Middleware para utilizar cookies
app.use(cookieParser());

// Middleware de errores
app.use(errorHandler);

// Middleware para usar cors
app.use(cors()); 

// Middleware para usar compression
app.use(compression({
    brotli: {enable: true}
}))

// Middleware para usar el session para autenticaciones de usuarios
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 15,
    }),
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
}))

// Rutas para productos y carritos
//app.use("/api/products", productRouter);
//app.use("/api/carts", cartRouter);

mongoose.connect(MONGO_URL, {
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

// Middleware de Passport para la autenticación de sesión
app.use(passport.initialize());
app.use(passport.session());

// Middleware para utilizar plantillas html
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", router);

// Función para generar productos simulados
const generateMockProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push({
            _id: new mongoose.Types.ObjectId(),
            title: faker.commerce.productName(),
            brand: faker.company.name(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            stock: faker.random.numeric(2),
            category: faker.commerce.department(),
            image: faker.image.imageUrl()
        });
    }
    return products;
};

// Endpoint para devolver productos simulados
app.get("/mockingproducts", (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

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