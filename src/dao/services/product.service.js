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

    updateProduct: async (updatedProductData, req, productId) => {
        const { title, brand, description, price, stock, category, userId } = updatedProductData;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                throw new Error('No se proporcionó una imagen válida');
            }

            // Crear instancia DTO
            const updateProductDTO = new ProductDTO(title, brand, description, price, stock, category, imageName, userId);

            // Paso directamente el DTO al repositorio
            const updateProduct = await productRepository.updateProduct(updateProductDTO);

            return updateProduct;
        }
        catch (error) {

        }
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