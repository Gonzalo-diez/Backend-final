class ProductDTO {
    constructor(title, brand, description, price, stock, category, image, userId) {
        this.title = title;
        this.brand = brand;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.image = image;
        this.userId = userId;
    }
}

export default ProductDTO;