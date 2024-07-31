class PurchaseDTO {
    constructor({user, products, shipping, payment}) {
        this.user = user;
        this.products = products;
        this.shipping = shipping;
        this.payment = payment;
    }
}

export default PurchaseDTO;