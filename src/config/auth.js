import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "jsonwebtoken";
import User from "../dao/models/user.model.js";
import bcrypt from "bcrypt";
import config from "./config.js";
import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from "../util.js"; 

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

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: process.env.CLIENT_ID || CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET || CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL || CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);//obtenemos el objeto del perfil
                    //buscamos en la db el email
                    const user = await User.findOne({
                        email: profile._json.email,
                    });
                    //si no existe lo creamos
                    if (!user) {
                        //contruimos el objeto según el modelo (los datos no pertenecientes al modelo lo seteamos por default)
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 20,
                            email: profile._json.email,
                            password: "",
                        };
                        //guardamos el usuario en la database
                        let createdUser = await User.create(newUser);
                        done(null, createdUser);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

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

// Función para extraer cookies
export const cookieExtractor = (req) => {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies["jwtToken"];
    }
    
    return token;
};

// Funcion para generar tokens
export const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    return token;
};

// Funcion para validar tokens
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.jwtToken;

    // Verificar si el token está presente en el encabezado de autorización o en la cookie jwtToken
    const token = authHeader ? authHeader.split(" ")[1] : cookieToken;

    if (!token) {
        return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    jwt.verify(token, config.jwtSecret, (error, user) => {
        if (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        req.user = user;
        next();
    });
};

// Middleware de autenticación para admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Acceso no autorizado' });
    }
};

// Middleware de autenticación para usuarios premium
export const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    } else {
        return res.status(403).json({ message: 'Acceso no autorizado' });
    }
};

// Middleware de autenticación para user
export const isUser = (req, res, next) => {
    if(req.user && req.user.role === 'user') {
        next();
    } 
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

export const isUserOrPremium = (req, res, next) => {
    if(req.user && req.user.role === 'user' || req.user.role === 'premium') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

export const isPremiumOrAdmin = (req, res, next) => {
    if(req.user && req.user.role === 'premium' || req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

export const isAll = (req, res, next) => {
    if(req.user && req.user.role === 'admin' || req.user.role === 'premium' || req.user.role === 'user') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

const auth = {
    initializePassport,
};

export default auth;