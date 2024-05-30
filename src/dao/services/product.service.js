import productRepository from "../Repositories/product.repository.js";
import ProductDTO from "../DTO/product.dto.js";
import userRepository from "../repositories/user.repository.js";
import logger from "../../utils/logger.js";

const productService = {
    getProducts: async (query, currentPage) => {
        try {
            logger.info(`Fetching products with query: ${JSON.stringify(query)} and page: ${currentPage}`);
            const products = await productRepository.getAllProducts(query, currentPage);
            logger.info(`Products fetched successfully: ${JSON.stringify(products)}`);
            return products;
        } catch (error) {
            logger.error(`Error fetching products - ${error.message}`);
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    getProductDetail: async (productId) => {
        try {
            logger.info(`Fetching product details for ID: ${productId}`);
            const productDetail = await productRepository.getProductById(productId);

            if (!productDetail) {
                logger.warn(`Product not found with ID: ${productId}`);
                throw { code: 'PRODUCT_NOT_FOUND' };
            }

            logger.info(`Product details fetched successfully: ${JSON.stringify(productDetail)}`);
            return productDetail;
        } catch (error) {
            logger.error(`Error fetching product details for ID: ${productId} - ${error.message}`);
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    getProductCategory: async (category, query, currentPage) => {
        try {
            logger.info(`Fetching products for category: ${category} with query: ${JSON.stringify(query)} and page: ${currentPage}`);
            const productCategory = await productRepository.getProductsByCategory(category, query, currentPage);
            logger.info(`Products fetched successfully for category: ${category}`);
            return productCategory;
        } catch (error) {
            logger.error(`Error fetching products for category: ${category} - ${error.message}`);
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    addProduct: async (productData, req) => {
        const { title, brand, description, price, stock, category, userId } = productData;

        try {
            logger.info(`Adding product with data: ${JSON.stringify(productData)}`);
            const user = await userRepository.findById(userId);

            // Si el usuario no esta logueado o registrado
            if (!user) {
                logger.warn(`User not found: ${userId}`);
                throw { code: 'USER_NOT_FOUND' };
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                logger.warn(`Invalid image for product: ${title}`);
                throw { code: 'INVALID_IMAGE' };
            }

            // Crear instancia DTO
            const productDTO = new ProductDTO(title, brand, description, price, stock, category, imageName, userId);

            // Paso directamente el DTO al repositorio
            const newProduct = await productRepository.createProduct(productDTO);

            logger.info(`Product added successfully: ${JSON.stringify(newProduct)}`);
            return newProduct;
        } catch (error) {
            logger.error(`Error adding product - ${error.message}`);
            throw { code: 'PRODUCT_CREATION_FAILED', message: error.message };
        }
    },

    updateProduct: async (productId, req, productUpdateData) => {
        const { title, brand, description, price, stock, category, userId } = productUpdateData;

        try {
            logger.info(`Updating product with ID: ${productId} with data: ${JSON.stringify(productUpdateData)}`);
            // Verificar si el producto existe
            const existingProduct = await productRepository.getProductById(productId);
            if (!existingProduct) {
                logger.warn(`Product not found with ID: ${productId}`);
                throw new Error("El producto no existe");
            }

            // Verificar si hay un archivo de imagen en la solicitud
            const imageName = req.file ? req.file.filename : existingProduct.imageName;

            if (!imageName) {
                logger.warn(`Invalid image for product update: ${productId}`);
                throw { code: 'INVALID_IMAGE' };
            }

            // Crear instancia DTO
            const updateProductDTO = new ProductDTO(
                title || existingProduct.title,
                brand || existingProduct.brand,
                description || existingProduct.description,
                price !== undefined ? price : existingProduct.price,
                stock !== undefined ? stock : existingProduct.stock,
                category || existingProduct.category,
                imageName,
                userId || existingProduct.user
            );

            // Paso directamente el DTO al repositorio
            const updatedProduct = await productRepository.updateProduct(productId, updateProductDTO);

            logger.info(`Product updated successfully: ${JSON.stringify(updatedProduct)}`);
            return updatedProduct;
        } catch (error) {
            logger.error(`Error updating product with ID: ${productId} - ${error.message}`);
            throw { code: 'PRODUCT_UPDATE_FAILED', message: error.message };
        }
    },

    getUpdateProduct: async () => {
        logger.info(`Fetching update product data`);
        return "updateProduct";
    },

    deleteProduct: async (productId) => {
        try {
            logger.info(`Deleting product with ID: ${productId}`);
            const product = await productRepository.getProductById(productId);

            if (!product) {
                logger.warn(`Product not found with ID: ${productId}`);
                throw { code: 'PRODUCT_NOT_FOUND' };
            }

            const deleteResult = await productRepository.deleteProductById(productId);

            if (!deleteResult) {
                logger.error(`Failed to delete product with ID: ${productId}`);
                throw { code: 'PRODUCT_DELETION_FAILED' };
            }

            logger.info(`Product deleted successfully: ${productId}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting product with ID: ${productId} - ${error.message}`);
            throw { code: 'PRODUCT_DELETION_FAILED', message: error.message };
        }
    }
}

export default productService;