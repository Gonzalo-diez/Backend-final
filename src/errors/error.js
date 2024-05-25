const errorDictionary = {
    PRODUCT_NOT_FOUND: {
        message: "El producto no se encuentra disponible.",
        statusCode: 404,
    },
    CART_NOT_FOUND: {
        message: "El carrito no se encuentra disponible.",
        statusCode: 404,
    },
    PRODUCT_CREATION_FAILED: {
        message: "No se pudo crear el producto.",
        statusCode: 500,
    },
    INVALID_IMAGE: {
        message: "Imagen o archivo no valido",
        statusCode: 400,
    },
    PRODUCT_UPDATE_FAILED: {
        message: "No se pudo actualizar el producto.",
        statusCode: 500,
    },
    PRODUCT_DELETION_FAILED: {
        message: "No se pudo eliminar el producto.",
        statusCode: 500,
    },
    PRODUCT_RETRIEVAL_FAILED: {
        message: "No se pudieron obtener los productos.",
        statusCode: 500,
    },
    ADD_TO_CART_FAILED: {
        message: "No se pudo agregar el producto al carrito.",
        statusCode: 500,
    },
    LOGIN_FAILED: {
        message: "No se pudo loguear el usuario",
        statusCode: 500,
    },
    REGISTER_FAILED: {
        message: "No se pudo registrar el usuario",
        statusCode: 500,
    },
    LOGIN_GITHUB_FAILED: {
        message: "No se pudo loguear el usuario utilizando github",
        statusCode: 500,
    },
    USER_NOT_FOUND: {
        message: "Usuario no encontrado",
        statusCode: 404,
    },
    USER_UNAUTHORIZED: {
        message: "Usuario no autorizado",
        statusCode: 401,
    },
    LOGOUT_FAILED: {
        message: "Logout fallido",
        statusCode: 500,
    },
}

export default errorDictionary;