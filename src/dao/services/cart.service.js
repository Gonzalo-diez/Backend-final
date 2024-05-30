import cartRepository from "../repositories/cart.repository.js";
import CartDTO from "../DTO/cart.dto.js";
import { generateRandomCode } from "../../util.js";
import userRepository from "../repositories/user.repository.js";
import productRepository from "../Repositories/product.repository.js";
import TicketDTO from "../DTO/ticket.dto.js";
import PurchaseDTO from "../DTO/purchase.dto.js";
import ticketRepository from "../repositories/ticket.repository.js";
import purchaseRepository from "../repositories/purchase.repository.js";
import logger from "../../utils/logger.js";

const cartService = {
    getCartById: async (cartId, userId) => {
        try {
            logger.info(`Fetching cart with ID: ${cartId} for user: ${userId}`);
            const cart = await cartRepository.getCartById(cartId, userId);

            let totalProducts = 0;
            let totalPrice = 0;

            cart.products.forEach(product => {
                totalProducts += product.productQuantity;
                totalPrice += product.productTotal;
            });

            cart.totalProducts = totalProducts;
            cart.totalPrice = totalPrice;

            logger.info(`Cart fetched successfully: ${JSON.stringify(cart)}`);

            return cart;
        } catch (error) {
            logger.error(`Error fetching cart by ID: ${cartId} for user: ${userId} - ${error.message}`);
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    getCartByUser: async(userId) => {
        try {
            logger.info(`Fetching cart for user: ${userId}`);
            const cartByUser = await cartRepository.getCartByUser(userId);
            logger.info(`Cart fetched successfully for user: ${userId}`);
            return cartByUser;
        } catch (error) {
            logger.error(`Error fetching cart for user: ${userId} - ${error.message}`);
            throw new Error("Error al buscar el carrito del usuario: " + error.message);
        }
    },

    addProductToCart: async (productId, userId) => {
        try {
            logger.info(`Adding product with ID: ${productId} to cart for user: ${userId}`);
            const user = await userRepository.findUser(userId);

            if (!user) {
                logger.warn(`User not logged in: ${userId}`);
                throw new Error("Usted no esta logueado");
            }

            const product = await productRepository.getProductForCart(productId);

            if (!product) {
                logger.warn(`Product not found: ${productId}`);
                throw new Error("Producto no encontrado");
            }

            if (product.stock < 1) {
                logger.warn(`Product out of stock: ${productId}`);
                throw new Error("Producto fuera de stock");
            }

            let cart = await cartRepository.findByUserId(userId);
            const newCart = await cartRepository.addProductToCart(productId, userId, cart, product);

            logger.info(`Product added to cart successfully: ${JSON.stringify(newCart)}`);

            return newCart;
        } catch (error) {
            logger.error(`Error adding product to cart for user: ${userId} - ${error.message}`);
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    },

    updateCart: async (cartId, products, total) => {
        try {
            logger.info(`Updating cart with ID: ${cartId}`);
            const cart = await cartRepository.updateCart(cartId, products, total);
            logger.info(`Cart updated successfully: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error updating cart with ID: ${cartId} - ${error.message}`);
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },

    updateProductQuantityInCart: async (cartId, productId, quantity) => {
        try {
            logger.info(`Updating quantity for product with ID: ${productId} in cart with ID: ${cartId}`);
            const cart = await cartRepository.updateProductQuantityInCart(cartId, productId, quantity);
            logger.info(`Product quantity updated successfully in cart: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error updating product quantity in cart with ID: ${cartId} - ${error.message}`);
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },

    purchaseCart: async (cartId, cartData) => {
        const { country, state, city, street, postal_code, phone, card_bank, security_number, userId } = cartData;

        try {
            logger.info(`Purchasing cart with ID: ${cartId} for user: ${userId}`);
            const cart = await cartRepository.getCartById(cartId, userId);

            let totalPurchaseAmount = 0;
            const productsToPurchase = [];
            const productsToKeepInCart = [];

            for (const item of cart.products) {
                const product = await productRepository.findProductById(item.product);

                if (!product) {
                    logger.warn(`Product with ID ${item.product} not found`);
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }

                if (product.stock >= item.productQuantity) {
                    product.stock -= item.productQuantity;
                    await product.save();

                    totalPurchaseAmount += item.productTotal;
                    productsToPurchase.push(item);
                } else {
                    productsToKeepInCart.push(item);
                }
            }

            if (productsToPurchase.length === 0) {
                logger.warn(`Insufficient stock for any products in cart with ID: ${cartId}`);
                throw new Error("No hay productos suficientes en stock para realizar la compra");
            }

            const shippingDTO = new CartDTO(country, state, city, street, postal_code, phone);
            const paymentDTO = new CartDTO(card_bank, security_number);

            const purchaseDTO = new PurchaseDTO({
                user: userId,
                products: productsToPurchase.map(item => ({
                    product: item.product,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal,
                })),
                shipping: shippingDTO,
                payment: paymentDTO,
            });

            const ticketDTO = new TicketDTO({
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

            const ticket = await ticketRepository.createTicket(ticketDTO);
            const purchase = await purchaseRepository.createPurchase(purchaseDTO);

            logger.info(`Purchase completed successfully: ${JSON.stringify(purchase)}`);

            await cartRepository.clearCart(cartId);
            await cartRepository.updateCart(cartId, productsToKeepInCart, totalPurchaseAmount);

            return ticket;
        } catch (error) {
            logger.error(`Error purchasing cart with ID: ${cartId} for user: ${userId} - ${error.message}`);
            throw new Error("Error al realizar la compra: " + error.message);
        }
    },

    getPurchaseCart: async () => {
        logger.info(`Fetching purchase cart`);
        return "purchase";
    },

    deleteProductFromCart: async (cartId, productId) => {
        try {
            logger.info(`Deleting product with ID: ${productId} from cart with ID: ${cartId}`);
            const cart = await cartRepository.deleteProductFromCart(cartId, productId);
            logger.info(`Product deleted successfully from cart: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error deleting product with ID: ${productId} from cart with ID: ${cartId} - ${error.message}`);
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    },

    clearCart: async (cartId) => {
        try {
            logger.info(`Clearing cart with ID: ${cartId}`);
            const cart = await cartRepository.clearCart(cartId);
            logger.info(`Cart cleared successfully: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error clearing cart with ID: ${cartId} - ${error.message}`);
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
}

export default cartService;