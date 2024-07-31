import cartRepository from "../repositories/cart.repository.js";
import { generateRandomCode } from "../../util.js";
import userRepository from "../repositories/user.repository.js";
import productRepository from "../repositories/product.repository.js";
import TicketDTO from "../DTO/ticket.dto.js";
import PurchaseDTO from "../DTO/purchase.dto.js";
import ticketRepository from "../repositories/ticket.repository.js";
import purchaseRepository from "../repositories/purchase.repository.js";
import logger from "../../utils/logger.js";

const cartService = {
    getCartById: async (cartId, userId) => {
        try {
            logger.info(`Buscando carrito por ID: ${cartId} para el user: ${userId}`);
            const cart = await cartRepository.getCartById(cartId, userId);

            let totalProducts = 0;
            let totalPrice = 0;

            cart.products.forEach(product => {
                totalProducts += product.productQuantity;
                totalPrice += product.productTotal;
            });

            cart.totalProducts = totalProducts;
            cart.totalPrice = totalPrice;

            logger.info(`Carrito encontrado exitosamente: ${JSON.stringify(cart)}`);

            return cart;
        } catch (error) {
            logger.error(`Error al buscar el carrito por ID: ${cartId} para el user: ${userId} - ${error.message}`);
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    getCartByUser: async(userId) => {
        try {
            logger.info(`Buscando carrito para el user: ${userId}`);
            const cartByUser = await cartRepository.getCartByUser(userId);
            logger.info(`Carrito encontrado con exito para el user: ${userId}`);
            return cartByUser;
        } catch (error) {
            logger.error(`Error al encontrar el carrito por el user: ${userId} - ${error.message}`);
            throw new Error("Error al buscar el carrito del usuario: " + error.message);
        }
    },

    addProductToCart: async (productId, userId, userRole) => {
        try {
            logger.info(`Agregando producto ID: ${productId} al carrito del user: ${userId}`);

            const product = await productRepository.getProductForCart(productId);

            if (!product) {
                logger.warn(`Producto no encontrado: ${productId}`);
                throw new Error("Producto no encontrado");
            }

            if (product.stock < 1) {
                logger.warn(`Producto fuera de stock: ${productId}`);
                throw new Error("Producto fuera de stock");
            }

            const user = await userRepository.findUser(userId);

            if (!user) {
                logger.warn(`User no logueado: ${userId}`);
                throw new Error("Usted no esta logueado");
            }

            if(userRole !== "user" && userRole !== "premium") {
                logger.warn(`User no autorizado`);
                throw new Error("Usted no esta autorizado");
            }

            if(userRole == "premium" && userId == product.owner) {
                logger.warn(`User es autor de este producto`);
                throw new Error("Usted es el creador de este producto, no puede agregarlo al carrito");
            }

            let cart = await cartRepository.findByUserId(userId);
            const newCart = await cartRepository.addProductToCart(productId, userId, cart, product);

            logger.info(`Producto agregado con exito al carrito: ${JSON.stringify(newCart)}`);

            return newCart;
        } catch (error) {
            logger.error(`Error al agregar el producto al carrito del user: ${userId} - ${error.message}`);
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    },

    updateCart: async (cartId, userId, products, total) => {
        try {
            logger.info(`Actualizando el carrito ID: ${cartId} para el usuario ID: ${userId}`);
            const cart = await cartRepository.updateCart(cartId, userId, products, total);
            logger.info(`Carrito actualizado con éxito: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error al actualizar el carrito ID: ${cartId} para el usuario ID: ${userId} - ${error.message}`);
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },    

    updateProductQuantityInCart: async (cartId, userId, productId, quantity) => {
        try {
            const parsedQuantity = parseInt(quantity, 10);
            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                throw new Error("La cantidad debe ser un valor positivo.");
            }
    
            logger.info(`Actualizando la cantidad del producto ID: ${productId} en el carrito ID: ${cartId}`);
            const cart = await cartRepository.updateProductQuantityInCart(cartId, productId, parsedQuantity);
            
            if (!cart) {
                throw new Error(`No se encontró el carrito con ID ${cartId}`);
            }
    
            logger.info(`Cantidad del producto actualizada con éxito en el carrito ID: ${cartId}`);
            return cart;
        } catch (error) {
            logger.error(`Error al actualizar la cantidad del producto en el carrito ID: ${cartId} - ${error.message}`);
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },    

    purchaseCart: async (cartId, cartData) => {
        const { country, state, city, street, postal_code, phone, card_bank, security_number, expired_date, userId } = cartData;
    
        try {
            logger.info(`Compra del carrito ID: ${cartId} del user: ${userId}`);
            const cart = await cartRepository.getCartById(cartId, userId);
    
            let totalPurchaseAmount = 0;
            const productsToPurchase = [];
            const productsToKeepInCart = [];
    
            for (const item of cart.products) {
                const product = await productRepository.findProductById(item.product);
    
                if (!product) {
                    logger.warn(`Producto ID ${item.product} no encontrado`);
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
                logger.warn(`Insuficiente stock para el producto en el carrito ID: ${cartId}`);
                throw new Error("No hay productos suficientes en stock para realizar la compra");
            }
    
            const shippingDTO = {
                country,
                state,
                city,
                street,
                postalCode: postal_code,
                phone
            };
            const paymentDTO = {
                cardBank: card_bank,
                securityNumber: security_number,
                expiredDate: expired_date,
            };
    
            const purchaseDTO = new PurchaseDTO({
                user: userId,
                products: productsToPurchase.map(item => ({
                    product: item.product,
                    quantity: item.productQuantity,
                    unitPrice: item.productPrice,
                    totalPrice: item.productTotal
                })),
                shipping: shippingDTO,
                payment: paymentDTO
            });
    
            console.log("Compra en proceso:", purchaseDTO);
    
            const ticketDTO = new TicketDTO({
                code: generateRandomCode(10),
                purchase_datetime: new Date(),
                amount: totalPurchaseAmount,
                purchaser: userId,
                products: productsToPurchase.map(item => ({
                    product: item.product.title,
                    productQuantity: item.productQuantity,
                    productTotal: item.productTotal
                }))
            });
    
            const ticket = await ticketRepository.createTicket(ticketDTO);
            const purchase = await purchaseRepository.createPurchase(purchaseDTO);
    
            console.log("Ticket:", ticket);
            console.log("Compra:", purchase);
    
            logger.info(`Compra exitosa: ${JSON.stringify(purchase)}`);
    
            await cartRepository.clearCart(cartId);
    
            return ticket;
        } catch (error) {
            logger.error(`Error al comprar en el carrito ID: ${cartId} for user: ${userId} - ${error.message}`);
            throw new Error("Error al realizar la compra: " + error.message);
        }
    },    

    getPurchaseCart: async () => {
        return "purchase";
    },

    deleteProductFromCart: async (cartId, userId, productId) => {
        try {
            logger.info(`Borrando el producto ID: ${productId} del carrito ID: ${cartId} del user: ${userId}`);
            const cart = await cartRepository.deleteProductFromCart(cartId, userId, productId);
            logger.info(`Producto borrado exitosamente del carrito: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error al borrar el producto ID: ${productId} del carrito ID: ${cartId} - ${error.message}`);
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    },

    clearCart: async (cartId) => {
        try {
            logger.info(`Vaciando el carrito ID: ${cartId}`);
            const cart = await cartRepository.clearCart(cartId);

            if(!cart) {
                logger.warn("No se encontro el carrito");
            }

            logger.info(`Carrito vaciado: ${JSON.stringify(cart)}`);
            return cart;
        } catch (error) {
            logger.error(`Error al vaciar el carrito ID: ${cartId} - ${error.message}`);
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
}

export default cartService;