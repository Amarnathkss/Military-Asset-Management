import api from "./api";

export const createTransfer = async (transferData) => {
    const response = await api.post(
        "/transfers",
        transferData
    );

    return response.data;
};

export const getTransfers = async () => {
    const response = await api.get("/transfers");

    return response.data;
};