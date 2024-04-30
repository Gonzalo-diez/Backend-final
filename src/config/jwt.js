import passport from "passport";
import passportJWT from "passport-jwt";
import config from "./config.js";
import { cookieExtractor } from "./auth.js";

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptionsExtractor = {
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: "jwtToken",
}

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
};

const strategyExtractor = new JwtStrategy(jwtOptionsExtractor, async (jwt_payload, done) => {
    try {
        if (jwt_payload) {
            return done(null, jwt_payload);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.error('Error en el middleware de Passport JWT:', error);
        return done(error, false);
    }
})

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


passport.use(strategyExtractor);
passport.use(strategy);

export default passport;