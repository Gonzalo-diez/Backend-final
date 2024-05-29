import winston from "winston";

const devLogger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: './errors-dev.log', level: 'info' })
    ]
});

const prodLogger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: './errors-prod.log', level: 'info' })
    ]
});

export const addLogger = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    req.logger = env === 'production' ? prodLogger : devLogger;

    next();
};