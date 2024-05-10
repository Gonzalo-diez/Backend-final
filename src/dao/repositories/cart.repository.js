import Cart from "../Models/cart.model.js";
import User from "../Models/user.model.js";

const CartRepository = {
    getCartById: async (cartId, userId) => {
        try {
            const cart = await Cart.findOne({ _id: cartId, user: userId })
                .populate("products.product")
                .populate("user")
                .lean();

            if (!cart) {
                throw new Error("El carrito no existe para este usuario");
            }

            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    createCart: async () => {
        try {
            const cart = new Cart({
                products: [],
                total: 0
            });

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    },

    /*
    buyCart: async (cartId, cartData) => {
        try {
            // Obtener el carrito por su ID
            const cart = await Cart.findById(cartId).populate('products.product').exec();

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            // Verificar si todos los campos obligatorios están presentes en el formulario
            if (!cartData) {
                throw new Error("Por favor complete todos los campos del formulario.");
            }

            // Iterar sobre los productos en el carrito
            for (const item of cart.products) {
                const product = item.product;

                // Verificar si el producto está definido y tiene un stock válido
                if (!product || typeof product.stock !== 'number' || product.stock < 0) {
                    throw new Error(`Producto inválido en el carrito`);
                }

                // Verificar si hay suficiente stock para la cantidad en el carrito
                if (product.stock < item.productQuantity) {
                    throw new Error(`No hay suficiente stock para ${product.title}`);
                }

                // Restar la cantidad comprada del stock del producto
                product.stock -= item.productQuantity;

                // Guardar el producto actualizado
                await product.save();
            }

            // Actualizar el modelo de usuario para agregar los productos comprados
            const user = await User.findById(userId);
            cart.products.forEach(item => {
                user.soldProducts.push(item.product);
            });
            await user.save();

            // Limpiar el carrito
            cart.products = [];
            await cart.save();

            // Retornar un mensaje de éxito
            return "Compra del carrito procesada con éxito.";
        } catch (error) {
            throw new Error("Error al realizar la compra del carrito: " + error.message);
        }
    },
    */

    updateCart: async (cartId, products, total) => {
        try {
            const cart = await Cart.findByIdAndUpdate(
                cartId,
                { products: products, total: total },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },

    updateProductQuantityInCart: async (cartId, productId, quantity) => {
        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $inc: { "products.$.productQuantity": quantity } },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    },

    deleteProductFromCart: async (cartId, productId) => {
        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { product: productId } } },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    },

    clearCart: async (cartId) => {
        try {
            const cart = await Cart.findByIdAndUpdate(
                cartId,
                { products: [], total: 0 },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
};

export default CartRepository;