import cartService from "../dao/services/cart.service.js";

const cartController = {
    getCartById: async (req, res) => {
        const cartId = req.params.cid;
        const user = req.session.user;
        const userId = req.session.userId;
        const jwtToken = req.session.token;
        const isAuthenticated = req.session.isAuthenticated;

        try {
            // Buscar el cart segund el id del usuario y del carrito si es que ya tiene uno
            const cart = await cartService.getCartById(cartId, userId);

            if (req.accepts("html")) {
                return res.render("cart", { cid: cart._id, Cart: cart, user, jwtToken, isAuthenticated });
            }

            return res.json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito por ID:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    addProductToCart: async (req, res) => {
        const { productId, userId, userRole } = req.body;

        try {
            // Agregar el producto al carrito del usuario
            const cart = await cartService.addProductToCart(productId, userId, userRole);

            return res.json({ message: "Producto agregado al carrito correctamente", cartItemId: cart._id });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    updateCart: async (req, res) => {
        const cartId = req.params.cid;
        const { products, userId, total } = req.body;
    
        try {
            // Actualiza el carrito según los productos que se guarden
            const cart = await cartService.updateCart(cartId, userId, products, total);
    
            return res.json(cart);
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },
    
    purchaseCart: async (req, res) => {
        const cartId = req.params.cid;
        const cartData = req.body;

        try {
            // Se encarga de generar la compra y el ticket de compra para el usuario
            const ticket = await cartService.purchaseCart(cartId, cartData);

            return res.json({ message: "Compra realizada exitosamente", ticket });
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            return res.status(500).json({ error: "Error al realizar la compra", details: error.message });
        }
    },

    getPurchaseCart: async (req, res) => {
        const cartId = req.params.cid;
        const userId = req.session.userId;
        const user = req.session.user;
        const jwtToken = req.session.token;
        const isAuthenticated = req.session.isAuthenticated;

        try {
            const cart = await cartService.getCartById(cartId, userId)
            const purchaseCartView = await cartService.getPurchaseCart();
            res.render(purchaseCartView, { user, jwtToken, Cart: cart, isAuthenticated })
        } catch (error) {

        }
    },

    updateProductQuantityInCart: async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity, userId } = req.body;
    
        try {
            // Actualiza la cantidad del producto que se encuentra dentro del cart
            const cart = await cartService.updateProductQuantityInCart(cid, userId, pid, quantity);
    
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            return res.json({ message: "Cantidad del producto en el carrito actualizada correctamente", cart });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },    

    deleteProductFromCart: async (req, res) => {
        const { cid, pid } = req.params;
        const { userId } = req.body;

        try {
            // Elimina el producto del cart
            const cart = await cartService.deleteProductFromCart(cid, userId, pid);

            return res.json({ message: "Producto eliminado del carrito correctamente", cart });
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    },

    clearCart: async (req, res) => {
        const cartId = req.params.cid;
        const { userId } = req.body;

        try {
            // Limpia el carrito por completo
            const cart = await cartService.clearCart(cartId, userId);

            return res.json({ message: "Carrito vaciado completamente", cart });
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            return res.status(500).json({ error: "Error en la base de datos", details: error.message });
        }
    }
};

export default cartController;