import Product from "../models/product.model.js";
import User from "../models/user.model.js";

const productService = {
    getProducts: async (query, currentPage) => {
        try {
            // Paginación
            const options = {
                limit: 10,
                page: currentPage,
                sort: { price: query.sort === 'asc' ? 1 : -1 }
            };

            let dbQuery = {};

            // Filtros 
            if (query.category) {
                dbQuery.category = query.category;
            }

            if (query.brand) {
                dbQuery.brand = query.brand;
            }

            // El uso de paginate para utilizar los filtros antes dichos
            const filter = await Product.paginate(dbQuery, options);
            const products = filter.docs.map(product => product.toObject());

            // Links para las páginas siguientes y anteriores
            let prevLink = null;
            if (filter.hasPrevPage) {
                prevLink = `/products?page=${filter.prevPage}`;
            }

            let nextLink = null;
            if (filter.hasNextPage) {
                nextLink = `/products?page=${filter.nextPage}`;
            }

            const response = {
                status: 'success',
                Products: products,
                query: {
                    totalDocs: filter.totalDocs,
                    limit: filter.limit,
                    totalPages: filter.totalPages,
                    page: filter.page,
                    pagingCounter: filter.pagingCounter,
                    hasPrevPage: filter.hasPrevPage,
                    hasNextPage: filter.hasNextPage,
                    prevPage: filter.prevPage,
                    nextPage: filter.nextPage,
                    prevLink: prevLink,
                    nextLink: nextLink
                },
            };

            return response;
        } catch (err) {
            throw new Error("Error al obtener los productos: " + err.message);
        }
    },

    getProductDetail: async (productId) => {
        try {
            const productDetail = await Product.findOne({ _id: productId }).lean();
            return productDetail;
        } catch (err) {
            throw new Error("Error al obtener el detalle del producto: " + err.message);
        }
    },

    getProductCategory: async (category, query, currentPage) => {
        try {
            // Paginación
            const options = {
                page: currentPage,
                limit: 10,
                sort: { price: query.sort === 'asc' ? 1 : -1 }
            };

            let dbQuery = { category };

            // Filtros
            if (query.brand) {
                dbQuery.brand = query.brand;
            }

            // El uso de paginate para utilizar los filtros antes dichos
            const filter = await Product.paginate(dbQuery, options);
            const filterDoc = filter.docs.map(product => product.toObject());

            // Links para las páginas siguientes y anteriores
            let prevLink = null;
            if (filter.hasPrevPage) {
                prevLink = `/products/${category}?page=${filter.prevPage}`;
            }

            let nextLink = null;
            if (filter.hasNextPage) {
                nextLink = `/products/${category}?page=${filter.nextPage}`;
            }

            const response = {
                status: 'success',
                Category: filterDoc,
                query: {
                    totalDocs: filter.totalDocs,
                    limit: filter.limit,
                    totalPages: filter.totalPages,
                    page: filter.page,
                    pagingCounter: filter.pagingCounter,
                    hasPrevPage: filter.hasPrevPage,
                    hasNextPage: filter.hasNextPage,
                    prevPage: filter.prevPage,
                    nextPage: filter.nextPage,
                    prevLink: prevLink,
                    nextLink: nextLink
                },
            };

            return response;
        } catch (err) {
            throw new Error("Error al obtener los productos de la categoría: " + err.message);
        }
    },

    addProduct: async (productData, req) => {
        const { title, brand, description, price, stock, category, userId } = productData;

        try {
            const user = await User.findById(userId).exec();

            // Si el usuario no esta logueado o registrado
            if (!user) {
                throw new Error("No está autorizado");
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                throw new Error('No se proporcionó una imagen válida');
            }

            const newProduct = new Product({
                title: title,
                brand: brand,
                description: description,
                price: price,
                stock: stock,
                category: category,
                image: imageName,
                user: userId,
            });

            await newProduct.save();

            return newProduct;
        } catch (err) {
            throw new Error("Error al guardar el producto: " + err.message);
        }
    },

    deleteProduct: async (productId, userId) => {
        try {
            const user = await User.findById(userId);

            // Si el usuario no esta logueado o registrado
            if (!user) {
                throw new Error("No está autorizado");
            }

            const deleteProduct = await Product.deleteOne({ _id: productId });

            if (deleteProduct.deletedCount === 0) {
                throw new Error("Producto no encontrado");
            }

            return true;
        } catch (err) {
            throw new Error("Error al eliminar el producto: " + err.message);
        }
    }
}

export default productService;
