import { fileURLToPath } from "url";
import path, { dirname } from "path";
import multer from "multer";
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.jwtSecret;
export const CLIENT_ID = process.env.clientId;
export const CLIENT_SECRET = process.env.clientSecret;
export const CALLBACK_URL = process.env.callbackURL;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const TWILIO_SSID = process.env.TWILIO_SSID;
export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const PHONE_NUMBER = process.env.PHONE_NUMBER;
export const PHONE_NUMBER_TO = process.env.PHONE_NUMBER_TO;

export function getProductsFilePath() {
    return path.join(__dirname, "../productos.json");
}

export function getCartFilePath() {
    return path.join(__dirname, "../carrito.json");
}

export function configureProductMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'img'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });    

    return multer({ storage: storage });
}

export default __dirname;