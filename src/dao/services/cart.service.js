import CartRepository from "../repositories/cart.repository.js";
import Product from "../Models/product.model.js";
import User from "../Models/user.model.js";
import Cart from "../Models/cart.model.js";
import CartDTO from "../DTO/cart.dto.js";

const cartService = {
    getCartById: async (cartId, userId) => {
        try {
            const cart = await CartRepository.getCartById(cartId, userId);

            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    addProductToCart: async (productId, userId) => {
        try {
            const user = await User.findById(userId);
            const product = await Product.findById(productId);
    
            if (!product) {
                throw new Error("Producto no encontrado");
            }
    
            if (product.stock < 1) {
                throw new Error("Producto fuera de stock");
            }
    
            // Crear un objeto de carrito DTO
            const cartDTO = new CartDTO({
                products: [{
                    product: productId,
                    productQuantity: 1,
                    productPrice: product.price,
                    productTotal: product.price * 1,
                }],
                total: product.price,
                user: user,
            });
    
            // Convertir el DTO a un modelo de Mongoose
            const cartData = new Cart(cartDTO);
    
            // Guardar el modelo en la base de datos
            const newCart = await cartData.save();
    
            return newCart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    },   

    updateCart: async (cartId, products, total) => {
        try {
            const cart = await CartRepository.updateCart(cartId, products, total);
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },

    updateProductQuantityInCart: async (cartId, productId, quantity) => {
        try {
            const cart = await CartRepository.updateProductQuantityInCart(cartId, productId, quantity);
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },

    deleteProductFromCart: async (cartId, productId) => {
        try {
            const cart = await CartRepository.deleteProductFromCart(cartId, productId);
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    },

    clearCart: async (cartId) => {
        try {
            const cart = await CartRepository.clearCart(cartId);
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
};

export default cartService;