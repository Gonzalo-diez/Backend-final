class CartDTO {
    constructor(products, total, country, state, city, street, postalCode, phone, cardBank, securityNumber, userId) {
        this.products = products;
        this.total = total;
        this.country = country;
        this.state = state;
        this.city = city;
        this.street = street;
        this.postalCode = postalCode;
        this.phone = phone;
        this.cardBank = cardBank;
        this.securityNumber = securityNumber;
        this.userId = userId;
    }
}

export default CartDTO;