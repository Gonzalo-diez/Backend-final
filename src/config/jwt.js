import passport from "passport";
import passportJWT from "passport-jwt";
import { JWT_SECRET } from "../util.js";

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    try {
        if (jwt_payload) {
            return next(null, jwt_payload);
        } else {
            return next(null, false);
        }
    } catch (error) {
        console.error('Error en el middleware de Passport JWT:', error);
        return next(error, false);
    }
});

passport.use(strategy);

export default passport;