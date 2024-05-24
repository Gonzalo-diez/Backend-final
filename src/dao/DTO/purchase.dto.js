class PurchaseDTO {
    constructor(userId, products, shipping, payment) {
        this.userId = userId;
        this.products = products;
        this.shipping = shipping;
        this.payment = payment;
    }
}

export default PurchaseDTO;