import errorDictionary from "./error.js";

const errorHandler = (err, req, res, next) => {
    const error = errorDictionary[err.code] || {
        message: 'Error interno del servidor',
        statusCode: 500,
    };

    res.status(error.statusCode).json({ error: error.message })
}

export default errorHandler;