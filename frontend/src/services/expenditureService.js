import api from "./api";

export const createExpenditure = async (expenditureData) => {
    const response = await api.post(
        "/expenditures",
        expenditureData
    );

    return response.data;
};