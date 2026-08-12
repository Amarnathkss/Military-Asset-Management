import api from "./api";

export const createPurchase = async (purchaseData) => {
    const response = await api.post(
        "/purchases",
        purchaseData
    );

    return response.data;
};