import productRepository from "../Repositories/product.repository.js";
import ProductDTO from "../DTO/product.dto.js";
import userRepository from "../repositories/user.repository.js";

const productService = {
    getProducts: async (query, currentPage) => {
        try {
            const products = await productRepository.getAllProducts(query, currentPage);
            return products;
        }
        catch (error) {
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    getProductDetail: async (productId) => {
        try {
            const productDetail = await productRepository.getProductById(productId);

            if(!productDetail) {
                throw { code: 'PRODUCT_NOT_FOUND' };
            }

            return productDetail;
        } catch (error) {
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    getProductCategory: async (category, query, currentPage) => {
        try {
            const productCategory = await productRepository.getProductsByCategory(category, query, currentPage);
            return productCategory;
        }
        catch (error) {
            throw { code: 'PRODUCT_RETRIEVAL_FAILED', message: error.message };
        }
    },

    addProduct: async (productData, req) => {
        const { title, brand, description, price, stock, category, userId } = productData;

        try {
            const user = await userRepository.findById(userId);

            // Si el usuario no esta logueado o registrado
            if (!user) {
                throw { code: 'USER_NOT_FOUND' };
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                throw { code: 'INVALID_IMAGE' };
            }

            // Crear instancia DTO
            const productDTO = new ProductDTO(title, brand, description, price, stock, category, imageName, userId);

            // Paso directamente el DTO al repositorio
            const newProduct = await productRepository.createProduct(productDTO);

            return newProduct;
        } catch (error) {
            throw { code: 'PRODUCT_CREATION_FAILED', message: error.message };
        }
    },

    updateProduct: async (productId, req, productUpdateData) => {
        const { title, brand, description, price, stock, category, userId } = productUpdateData;

        try {
            // Verificar si el producto existe
            const existingProduct = await productRepository.getProductById(productId);
            if (!existingProduct) {
                throw new Error("El producto no existe");
            }

            // Verificar si hay un archivo de imagen en la solicitud
            const imageName = req.file ? req.file.filename : existingProduct.imageName;

            if (!imageName) {
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

            return updatedProduct;
        } catch (error) {
            throw { code: 'PRODUCT_UPDATE_FAILED', message: error.message };
        }
    },

    getUpdateProduct: async () => {
        return "updateProduct";
    },

    deleteProduct: async (productId) => {
        try {
            const product = await productRepository.getProductById(productId);

            if (!product) {
                throw { code: 'PRODUCT_NOT_FOUND' }
            }

            const deleteResult = await productRepository.deleteProductById(productId);

            if (!deleteResult) {
                throw { code: 'PRODUCT_DELETION_FAILED' };
            }

            return true;
        } catch (error) {
            throw { code: 'PRODUCT_DELETION_FAILED', message: error.message };
        }
    }
};

export default productService;