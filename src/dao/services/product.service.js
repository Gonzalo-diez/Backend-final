import productRepository from "../repositories/product.repository.js";
import ProductDTO from "../DTO/product.dto.js";
import userRepository from "../repositories/user.repository.js";
import logger from "../../utils/logger.js";

const productService = {
    getProducts: async (query, currentPage) => {
        try {
            const products = await productRepository.getAllProducts(query, currentPage);
            logger.info(`Productos encontrados: ${JSON.stringify(products)}`);
            return products;
        } catch (error) {
            logger.error(`Error al buscar los productos - ${error.message}`);
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    getProductDetail: async (productId) => {
        try {
            logger.info(`Buscando producto ID: ${productId}`);
            const productDetail = await productRepository.getProductById(productId);

            if (!productDetail) {
                logger.warn(`Producto no encontrado ID: ${productId}`);
                throw { code: 'PRODUCT_NOT_FOUND' };
            }

            logger.info(`Producto encontrado exitosamente: ${JSON.stringify(productDetail)}`);
            return productDetail;
        } catch (error) {
            logger.error(`Error al encontrar el producto ID: ${productId} - ${error.message}`);
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    getProductCategory: async (category, query, currentPage) => {
        try {
            const productCategory = await productRepository.getProductsByCategory(category, query, currentPage);
            logger.info(`Productos de la categoria encontrados exitosamente: ${category}`);
            return productCategory;
        } catch (error) {
            logger.error(`Error al buscar los productos por su categoria: ${category} - ${error.message}`);
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    addProduct: async (productData, req) => {
        const { title, brand, description, price, stock, category, userId } = productData;

        try {
            logger.info(`Agregando los datos del producto: ${JSON.stringify(productData)}`);
            const user = await userRepository.findById(userId);

            // Si el usuario no esta logueado o registrado
            if (!user) {
                logger.warn(`User no encontrado: ${userId}`);
                throw { code: 'USER_NOT_FOUND' };
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                logger.warn(`Imagen invalida para el producto: ${title}`);
                throw { code: 'INVALID_IMAGE' };
            }

            // Crear instancia DTO
            const productDTO = new ProductDTO(title, brand, description, price, stock, category, imageName, userId);

            // Paso directamente el DTO al repositorio
            const newProduct = await productRepository.createProduct(productDTO);

            logger.info(`Producto agregado exitosamente: ${JSON.stringify(newProduct)}`);
            return newProduct;
        } catch (error) {
            logger.error(`Error al agregar el producto - ${error.message}`);
            throw { code: 'PRODUCT_CREATION_FAILED', message: error.message };
        }
    },

    updateProduct: async (productId, req, productUpdateData, userId) => {
        const { title, brand, description, price, stock, category } = productUpdateData;
    
        try {
            logger.info(`Actualizando el producto ID: ${productId} with data: ${JSON.stringify(productUpdateData)}`);
    
            // Verificar si el producto existe
            const existingProduct = await productRepository.getProductById(productId);
            if (!existingProduct) {
                logger.warn(`Producto no encontrado ID: ${productId}`);
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
                userId || existingProduct.owner
            );
    
            // Paso directamente el DTO al repositorio
            const updatedProduct = await productRepository.updateProduct(productId, updateProductDTO);
    
            logger.info(`Producto actualizado exitosamente: ${JSON.stringify(updatedProduct)}`);
            return updatedProduct;
        } catch (error) {
            logger.error(`Error al actualizar el producto ID: ${productId} - ${error.message}`);
            throw { code: 'PRODUCT_UPDATE_FAILED', message: error.message };
        }
    },    

    getUpdateProduct: async () => {
        return "updateProduct";
    },

    deleteProduct: async (productId) => {
        try {
            logger.info(`Borrando el producto ID: ${productId}`);
            const product = await productRepository.getProductById(productId);
    
            if (!product) {
                logger.warn(`Producto no encontrado ID: ${productId}`);
                throw { code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado' };
            }
    
            const deleteResult = await productRepository.deleteProductById(productId);
    
            if (!deleteResult) {
                logger.error(`No se pudo eliminar el producto ID: ${productId}`);
                throw { code: 'PRODUCT_DELETION_FAILED', message: 'No se pudo eliminar el producto' };
            }
    
            logger.info(`Producto eliminado exitosamente: ${productId}`);
            return true;
        } catch (error) {
            logger.error(`Error al borrar el producto ID: ${productId} - ${error.message}`);
            throw { code: 'PRODUCT_DELETION_FAILED', message: error.message };
        }
    }    
}

export default productService;