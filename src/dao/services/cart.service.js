import CartRepository from "../repositories/cart.repository.js";
import Product from "../Models/product.model.js";
import User from "../Models/user.model.js";
import Cart from "../Models/cart.model.js";
import Ticket from "../models/ticket.model.js";
import CartDTO from "../DTO/cart.dto.js";
import { generateRandomCode } from "../../util.js";
import Purchase from "../models/purchase.model.js";

const cartService = {
    getCartById: async (cartId, userId) => {
        try {
            const cart = await CartRepository.getCartById(cartId, userId);

            // Calcula el total de productos y el total a pagar
            let totalProducts = 0;
            let totalPrice = 0;

            cart.products.forEach(product => {
                totalProducts += product.productQuantity;
                totalPrice += product.productTotal;
            });

            // Agrega los totales al objeto de carrito
            cart.totalProducts = totalProducts;
            cart.totalPrice = totalPrice;


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

            // Busca el carrito existente del usuario
            let cart = await Cart.findOne({ user: userId });

            if (cart) {
                // Carrito existe, agregar o actualizar el producto
                const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

                if (productIndex > -1) {
                    // Producto ya existe en el carrito, actualizar cantidad y total
                    cart.products[productIndex].productQuantity += 1;
                    cart.products[productIndex].productTotal += product.price;
                } else {
                    // Producto no existe en el carrito, agregar nuevo producto
                    cart.products.push({
                        product: productId,
                        productQuantity: 1,
                        productPrice: product.price,
                        productTotal: product.price,
                    });
                }

                // Actualizar total del carrito
                cart.total += product.price;
            } else {
                // Carrito no existe, crear nuevo carrito
                const cartItem = new Cart({
                    products: [{
                        product: productId,
                        productQuantity: 1,
                        productPrice: product.price,
                        productTotal: product.price,
                    }],
                    total: product.price,
                    user: userId,
                });

                // Guardar el nuevo carrito en la base de datos
                cart = await cartItem.save();
            }

            // Guardar el carrito actualizado o nuevo en la base de datos
            const newCart = await cart.save();

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

    purchaseCart: async (cartId, cartData) => {
        const { country, state, city, street, postal_code, phone, card_bank, security_number, userId } = cartData;

        try {
            const cart = await CartRepository.getCartById(cartId, userId);

            let totalPurchaseAmount = 0;
            const productsToPurchase = [];
            const productsToKeepInCart = [];

            for (const item of cart.products) {
                const product = await Product.findById(item.product);

                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }

                if (product.stock >= item.productQuantity) {
                    // Suficiente stock, reducir stock y agregar a la compra
                    product.stock -= item.productQuantity;
                    await product.save();

                    totalPurchaseAmount += item.productTotal;
                    productsToPurchase.push(item);
                } else {
                    // No suficiente stock, mantener en el carrito
                    productsToKeepInCart.push(item);
                }
            }

            if (productsToPurchase.length === 0) {
                throw new Error("No hay productos suficientes en stock para realizar la compra");
            }

            // Crear instancia DTO
            const shippingDTO = new CartDTO(country, state, city, street, postal_code, phone);

            const paymentDTO = new CartDTO(card_bank, security_number);

            const purchase = new Purchase({
                user: userId,
                products: productsToPurchase.map(item => ({
                    product: item.product,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal,
                })),
                shipping: shippingDTO,
                payment: paymentDTO,
            })

            // Crear el ticket de compra con los productos que se pueden comprar
            const ticket = new Ticket({
                code: generateRandomCode(10),
                purchaseDatetime: new Date(),
                amount: totalPurchaseAmount,
                purchaser: userId,
                products: productsToPurchase.map(item => ({
                    id: item.product,
                    product: item.product.title,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal,
                })),
            });

            await ticket.save();

            await purchase.save();

            // Limpiar el carrito y mantener los productos que no se pudieron comprar
            await CartRepository.clearCart(cartId);
            await CartRepository.updateCart(cartId, productsToKeepInCart, totalPurchaseAmount);

            return ticket;
        } catch (error) {
            throw new Error("Error al realizar la compra: " + error.message);
        }
    },

    getPurchaseCart: async () => {
        return "purchase";
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