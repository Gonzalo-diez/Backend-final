import Cart from "../models/cart.model.js";

const cartRepository = {
    findByUserId: async (userId) => {
        try {
            const cart = await Cart.findOne({ user: userId });

            return cart;
        }
        catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    getCartById: async (cartId, userId) => {
        try {
            const cart = await Cart.findOne({ _id: cartId, user: userId })
                .populate('products.product')
                .populate({
                    path: 'user',
                    model: 'User'
                })
                .lean();

            if (!cart) {
                throw new Error("No se encontro el carrito");
            }

            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    },

    getCartByUser: async(userId) => {
        try {
            const cart = await Cart.find({user: userId}).lean();

            if(!cart) {
                throw new Error("Usted no es el creador de este carrito");
            }

            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por userId: " + error.message);
        }
    },

    addProductToCart: async (productId, userId, cart, product) => {
        try {
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

    updateCart: async (cartId, userId, newProducts, total) => {
        try {
            const cart = await Cart.findById(cartId);
    
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }
    
            // Verificar que el userId del carrito coincide con el userId proporcionado
            if (cart.user.toString() !== userId) {
                throw new Error("No autorizado para actualizar este carrito");
            }
    
            // Iterar sobre los nuevos productos para actualizar o agregar
            newProducts.forEach(newProduct => {
                const existingProduct = cart.products.find(p => p.product.toString() === newProduct.product);
    
                if (existingProduct) {
                    // Si el producto ya existe, actualiza la cantidad y el total
                    existingProduct.productQuantity += newProduct.productQuantity;
                    existingProduct.productTotal += newProduct.productTotal;
                } else {
                    // Si el producto no existe, añádelo al array
                    cart.products.push(newProduct);
                }
            });
    
            // Actualiza el total del carrito
            cart.total = total;
    
            // Guarda el carrito actualizado
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    },    

    updateProductQuantityInCart: async (cartId, productId, parsedQuantity) => {
        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $inc: { "products.$.productQuantity": parsedQuantity } },
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
            const cart = await Cart.findByIdAndDelete(
                cartId,
                { new: true }
            );
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar el carrito: " + error.message);
        }
    }
};

export default cartRepository;