import api from "./api";

export const getInventoryMetrics = async (params) => {
    const response = await api.get(
        "/assets/dashboard",
        {
            params,
        }
    );

    return response.data;
};