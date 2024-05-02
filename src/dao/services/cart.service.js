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

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            if (product.stock < 1) {
                throw new Error("Producto fuera de stock");
            }

            let cart = await Cart.findOne({});

            if (!cart) {
                cart = new Cart({
                    items: [],
                    user: user
                });
            }

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

            cart.items.push(cartItem);
            cart.total += cartItem.productTotal;

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    },

    updateCart: async (cartId, userId, products) => {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para actualizar este carrito");
            }

            for (const newProduct of products) {
                const existingProductIndex = cart.items.findIndex(item => item.product.toString() === newProduct.productId);

                if (existingProductIndex !== -1) {
                    cart.items[existingProductIndex].productQuantity += newProduct.productQuantity;
                    cart.items[existingProductIndex].productTotal += newProduct.productQuantity * cart.items[existingProductIndex].productPrice;
                } else {
                    const product = await Product.findById(newProduct.productId);

                    if (!product) {
                        console.log(`Producto con ID ${newProduct.productId} no encontrado`);
                        continue;
                    }

                    const cartItem = {
                        product: newProduct.productId,
                        productQuantity: newProduct.productQuantity,
                        productPrice: product.price,
                        productTotal: product.price * newProduct.productQuantity
                    };

                    cart.items.push(cartItem);
                    cart.total += cartItem.productTotal;
                }
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },

    updateProductQuantityInCart: async (cartId, userId, productId, quantity) => {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para actualizar este carrito");
            }

            const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            const productInCart = cart.items[productIndex];
            const product = await Product.findById(productInCart.product);

            if (!product) {
                throw new Error("Producto no encontrado en la base de datos");
            }

            productInCart.productQuantity += parseInt(quantity);
            productInCart.productTotal += product.price * parseInt(quantity);
            cart.total += product.price * parseInt(quantity);

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },

    deleteProductFromCart: async (cartId, userId, productId) => {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para borrar este producto del carrito");
            }

            const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error("Producto no encontrado");
            }

            const productToRemove = cart.items[productIndex];
            const productPrice = productToRemove.productPrice;
            const productQuantity = productToRemove.productQuantity;

            cart.total -= productPrice * productQuantity;
            cart.items.splice(productIndex, 1);

            if (cart.items.length === 0) {
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

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            if (cart.user.toString() !== userId) {
                throw new Error("No tienes permiso para borrar este carrito");
            }

            cart.items = [];
            cart.total = 0;

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
};

export default cartService;