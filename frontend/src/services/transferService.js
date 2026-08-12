import api from "./api";

export const createTransfer = async (transferData) => {
    const response = await api.post(
        "/transfers",
        transferData
    );

    return response.data;
};