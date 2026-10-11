
import api from "./api";

// Récupérer les statistiques du dashboard Admin
export const getAdminStatistics = async () => {
    const response = await api.get("/api/admin/statistics");
    return response.data;
};
