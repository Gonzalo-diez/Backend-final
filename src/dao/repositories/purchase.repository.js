import Purchase from "../models/purchase.model.js";

const purchaseRepository = {
    createPurchase: async (purchaseData) => {
        const purchase = new Purchase(purchaseData);
        return await purchase.save();
    }
}

export default purchaseRepository;