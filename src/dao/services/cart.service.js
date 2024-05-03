import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

const cartService = {
    getCartById: async (cartId) => {
        try {
            const cart = await Cart.findById(cartId)
                .populate({
                    path: 'products',
                    model: 'Product'
                })
                .lean();

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    addProductToCart: async (productId, userId) => {
        try {
            const user = await User.findById(userId);

            const product = await Product.findById(productId);

            // Verificar si el producto existe
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            // Verificar que el producto tiene stock
            if (product.stock < 1) {
                throw new Error("Producto fuera de stock");
            }

            let cart = await Cart.findOne({});

            if (!cart) {
                cart = new Cart({
                    products: [],
                    user: user
                });
            }

            // Los items del carrito que se guardaran
            const cartItem = new Cart({
                products: [{
                    product: productId,
                    productQuantity: 1,
                    productPrice: product.price,
                    productTotal: product.price * 1,
                }],
                total: product.price,
                user: user,
            });

            await cartItem.save();

            return cart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    },

    updateCart: async (cartId, userId, products) => {
        try {
            const cart = await Cart.findById(cartId);

            // Verificar si el carrito existe
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para actualizar este carrito");
            }

            // Iterar sobre los nuevos productos y actualizar el carrito
            for (const newProduct of products) {
                const existingProductIndex = cart.products.findIndex(item => item.product.toString() === newProduct.productId);

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].productQuantity += newProduct.productQuantity;
                    cart.products[existingProductIndex].productTotal += newProduct.productQuantity * cart.products[existingProductIndex].productPrice;
                } else {
                    const product = await Product.findById(newProduct.productId);

                    if (!product) {
                        console.log(`Producto con ID ${newProduct.productId} no encontrado`);
                        continue;
                    }

                    cart.products.push({
                        product: product,
                        productQuantity: newProduct.productQuantity,
                        productPrice: product.price,
                        productTotal: newProduct.productQuantity * product.price,
                    });
                }
            }

            // Calcular el nuevo total del carrito sumando los subtotales de todos los productos
            cart.total = cart.products.reduce((total, product) => total + product.productTotal, 0);

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },

    updateProductQuantityInCart: async (cartId, userId, productId, quantity) => {
        try {
            const cart = await Cart.findById(cartId);

            // Verificar si el carrito existe
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para actualizar este carrito");
            }

            // Buscar el índice del producto en la matriz de productos del carrito
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            // Obtener el producto del carrito
            const productInCart = cart.products[productIndex];

            // Obtener el producto desde la base de datos para obtener su precio
            const product = await Product.findById(productInCart.product);

            if (!product) {
                throw new Error("Producto no encontrado en la base de datos");
            }

            // Actualizar la cantidad del producto en el carrito
            productInCart.productQuantity += parseInt(quantity);

            // Actualizar el total en función del precio del producto y la nueva cantidad
            productInCart.productTotal += product.price * parseInt(quantity);

            // Recalcular el total del carrito sumando los precios de todos los productos
            cart.total += product.price * parseInt(quantity);

            // Guardar los cambios en la base de datos
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },

    deleteProductFromCart: async (cartId, userId, productId) => {
        try {
            const cart = await Cart.findById(cartId);

            // Verificar si el carrito existe
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para borrar este producto del carrito");
            }

            // Buscar el índice del producto en la matriz de productos del carrito
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error("Producto no encontrado");
            }

            const productToRemove = cart.products[productIndex];
            const productPrice = productToRemove.productPrice;
            const productQuantity = productToRemove.productQuantity;

            // Restar la cantidad y el total del producto eliminado 
            cart.total -= productPrice * productQuantity;
            cart.products.splice(productIndex, 1);

            // Si el carrito queda vacío, establecer el total en 0
            if (cart.products.length === 0) {
                cart.total = 0;
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    },

    clearCart: async (cartId, userId) => {
        try {
            const cart = await Cart.findById(cartId);

            // Verificar si el carrito existe
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            // Verificar si el usuario que intenta actualizar el carrito es el propietario del carrito
            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para borrar este carrito");
            }

            cart.products = []
            cart.total = 0;

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
};

export default cartService;