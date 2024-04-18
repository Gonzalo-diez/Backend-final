import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "jsonwebtoken";
import User from "../dao/models/user.model.js";
import bcrypt from "bcrypt";
import { JWT_SECRET, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from "../util.js";

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
                clientID: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                callbackURL: CALLBACK_URL,
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

export const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    console.log(authHeader);

    const token = authHeader.split(" ")[1];

    // Error para ver, cada vez que realizo un logout, se produce el error de JsonWebTokenError: jwt malformed
    jwt.verify(token, JWT_SECRET, (error, credentials) => {
        console.log(error);

        if (error) {
            console.error('JWT Verification Error:', error);
            // Handle the error appropriately
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        req.user = credentials.user;
        next();
    })
}

const auth = {
    initializePassport,
};

export default auth;