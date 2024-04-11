import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import User from "../dao/models/user.model.js";
import config from "./config.js";
import bcrypt from "bcrypt";

const initializePassport = () => {
    // Configurar estrategia de autenticación local
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serializar y deserializar usuario para guardar en sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    return token;
};

const auth = {
    initializePassport,
    generateAuthToken
};

export default auth;