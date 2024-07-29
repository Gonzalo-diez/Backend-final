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

    addProduct: async (productData, file) => {
        const { title, brand, description, price, stock, category, owner } = productData;

        try {
            logger.info(`Agregando los datos del producto: ${JSON.stringify(productData)}`);
            const user = await userRepository.findById(owner);

            // Si el usuario no esta logueado o registrado
            if (!user) {
                logger.warn(`User no encontrado: ${owner}`);
                throw { code: 'USER_NOT_FOUND' };
            }

            const imageName = file ? file.filename : null;

            // Verificar que se subi una imagen valida
            if (!imageName) {
                logger.warn(`Imagen invalida para el producto: ${title}`);
                throw { code: 'INVALID_IMAGE' };
            }

            // Verificar que los valores de stock y price sean positivos
            if (price < 0 || stock < 0) {
                logger.warn("El precio y/o stock deben de ser de valores positivos");
                throw { code: 'PRODUCT_POSITIVE_VALUE' };
            }

            // Crear instancia DTO
            const productDTO = new ProductDTO(title, brand, description, price, stock, category, imageName, owner);

            // Paso directamente el DTO al repositorio
            const newProduct = await productRepository.createProduct(productDTO);

            logger.info(`Producto agregado exitosamente: ${JSON.stringify(newProduct)}`);
            return newProduct;
        } catch (error) {
            logger.error(`Error al agregar el producto - ${error.message}`);
            throw { code: 'PRODUCT_CREATION_FAILED', message: error.message };
        }
    },

    updateProduct: async (productId, req, updateData, userId, user, userRole, product) => {
        try {
            logger.info(`Actualizando el producto ID: ${productId} del usuario: ${userId} con data: ${JSON.stringify(updateData)}`);
    
            // Verificar si el producto existe
            const existingProduct = await productRepository.getProductById(productId);
            if (!existingProduct) {
                logger.warn(`Producto no encontrado ID: ${productId}`);
                throw new Error("El producto no existe");
            }
    
            if (userRole !== 'admin' && !(userRole === 'premium' && user._id.toString() === product.owner._id.toString())) {
                logger.warn("Usted no está autorizado");
                throw new Error("No tiene los permisos requeridos");
            }
    
            // Verificar si hay un archivo de imagen en la solicitud
            if (req.file) {
                updateData.imageName = req.file.filename;
            }
    
            // Verificar que los valores de stock y price sean positivos
            if (updateData.price < 0 || updateData.stock < 0) {
                logger.warn("El precio y/o stock deben de ser de valores positivos");
                throw { code: 'PRODUCT_POSITIVE_VALUE' };
            }
    
            // Paso los datos de actualización directamente al repositorio
            const updatedProduct = await productRepository.updateProduct(productId, updateData);
    
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