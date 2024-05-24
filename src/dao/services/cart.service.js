import cartRepository from "../repositories/cart.repository.js";
import CartDTO from "../DTO/cart.dto.js";
import { generateRandomCode } from "../../util.js";
import userRepository from "../repositories/user.repository.js";
import productRepository from "../Repositories/product.repository.js";
import TicketDTO from "../DTO/ticket.dto.js";
import PurchaseDTO from "../DTO/purchase.dto.js";
import ticketRepository from "../repositories/ticket.repository.js";
import purchaseRepository from "../repositories/purchase.repository.js";

const cartService = {
    getCartById: async (cartId, userId) => {
        try {
            const cart = await cartRepository.getCartById(cartId, userId);

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

            console.log(cart);

            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    getCartByUser: async(userId) => {
        try {
            const cartByUser = await cartRepository.getCartByUser(userId);

            return cartByUser;
        }
        catch (error) {
            throw new Error("Error al buscar el carrito del usuario")
        }
    },

    addProductToCart: async (productId, userId) => {
        try {
            const user = await userRepository.findUser(userId);

            if(!user) {
                throw new Error("Usted no esta logueado");
            }
            
            const product = await productRepository.getProductForCart(productId);

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            if (product.stock < 1) {
                throw new Error("Producto fuera de stock");
            }

            // Busca el carrito existente del usuario
            let cart = await cartRepository.findByUserId(userId);

            const newCart = await cartRepository.addProductToCart(productId, userId, cart, product);

            console.log(newCart);

            return newCart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    },

    updateCart: async (cartId, products, total) => {
        try {
            const cart = await cartRepository.updateCart(cartId, products, total);
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },

    updateProductQuantityInCart: async (cartId, productId, quantity) => {
        try {
            const cart = await cartRepository.updateProductQuantityInCart(cartId, productId, quantity);
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },

    purchaseCart: async (cartId, cartData) => {
        const { country, state, city, street, postal_code, phone, card_bank, security_number, userId } = cartData;

        try {
            const cart = await cartRepository.getCartById(cartId, userId);

            let totalPurchaseAmount = 0;
            const productsToPurchase = [];
            const productsToKeepInCart = [];

            for (const item of cart.products) {
                const product = await productRepository.findProductById(item.product);

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

            const purchaseDTO = new PurchaseDTO({
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

            console.log(purchase);

            // Limpiar el carrito y mantener los productos que no se pudieron comprar
            await cartRepository.clearCart(cartId);
            await cartRepository.updateCart(cartId, productsToKeepInCart, totalPurchaseAmount);

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
            const cart = await cartRepository.deleteProductFromCart(cartId, productId);
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    },

    clearCart: async (cartId) => {
        try {
            const cart = await cartRepository.clearCart(cartId);
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
};

export default cartService;