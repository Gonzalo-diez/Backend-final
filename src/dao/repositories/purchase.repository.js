import Purchase from "../models/purchase.model.js";

const purchaseRepository = {
    // Método para guardar los datos de compra
    createPurchase: async (purchaseData) => {
        const purchase = new Purchase(purchaseData);
        return await purchase.save();
    }
}

export default purchaseRepository;