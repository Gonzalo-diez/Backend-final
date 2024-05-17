import productRepository from "../Repositories/product.repository.js";
import ProductDTO from "../DTO/product.dto.js";
import User from "../Models/user.model.js";

const productService = {
    getProducts: async (query, currentPage) => {
        try {
            const products = await productRepository.getAllProducts(query, currentPage);
            return products;
        }
        catch (error) {
            throw new Error("Error al obtener los productos: " + error.message);
        }
    },

    getProductDetail: async (productId) => {
        try {
            const productDetail = await productRepository.getProductById(productId);
            return productDetail;
        } catch (error) {
            throw new Error("Error al obtener el detalle del producto: " + error.message);
        }
    },

    getProductCategory: async (category, query, currentPage) => {
        try {
            const productCategory = await productRepository.getProductsByCategory(category, query, currentPage);
            return productCategory;
        }
        catch (error) {
            throw new Error("Error al obtener los productos por categoria: " + error.message);
        }
    },

    addProduct: async (productData, req) => {
        const { title, brand, description, price, stock, category, userId } = productData;

        try {
            const user = await User.findById(userId).exec();

            // Si el usuario no esta logueado o registrado
            if (!user) {
                throw new Error("No es el administrador");
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                throw new Error('No se proporcionó una imagen válida');
            }

            // Crear instancia DTO
            const productDTO = new ProductDTO(title, brand, description, price, stock, category, imageName, userId);

            // Paso directamente el DTO al repositorio
            const newProduct = await productRepository.createProduct(productDTO);

            return newProduct;
        } catch (error) {
            throw new Error("Error al guardar el producto: " + error.message);
        }
    },

    updateProduct: async (productId, req) => {
        const { title, brand, description, price, stock, category, userId } = req.body;

        try {
            // Verificar si el producto existe
            const existingProduct = await productRepository.getProductById(productId);
            if (!existingProduct) {
                throw new Error("El producto no existe");
            }

            // Verificar si hay un archivo de imagen en la solicitud
            const imageName = req.file ? req.file.filename : existingProduct.imageName;

            // Crear instancia DTO
            const updateProductDTO = new ProductDTO(
                title || existingProduct.title,
                brand || existingProduct.brand,
                description || existingProduct.description,
                price !== undefined ? price : existingProduct.price,
                stock !== undefined ? stock : existingProduct.stock,
                category || existingProduct.category,
                imageName,
                userId || existingProduct.userId
            );

            // Paso directamente el DTO al repositorio
            const updatedProduct = await productRepository.updateProduct(productId, updateProductDTO);

            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    },

    getUpdateProduct: async () => {
        return "updateProduct";
    },

    deleteProduct: async (productId, userId) => {
        try {
            const product = await productRepository.getProductById(productId);

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            // Verificar si el usuario que intenta borrar el producto es el propietario del producto
            if (product.user.toString() !== userId) {
                throw new Error("No tienes permiso para borrar el producto");
            }

            const deleteResult = await productRepository.deleteProductById(productId);

            if (!deleteResult) {
                throw new Error("Error al eliminar el producto");
            }

            return true;
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }
};

export default productService;