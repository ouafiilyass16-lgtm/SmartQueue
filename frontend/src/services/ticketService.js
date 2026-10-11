
import api from "./api";

// Créer un ticket
export const createTicket = async (queueId) => {
    const response = await api.post("api/tickets", { queueId });
    return response.data;
};

// Récupérer uniquement les tickets du client connecté
export const getMyTickets = async () => {
    const response = await api.get("api/tickets/my");
    return response.data;
};

// Récupérer tous les tickets (usage réservé aux rôles autorisés)
export const getTickets = async () => {
    const response = await api.get("api/tickets");
    return response.data;
};

// Récupérer un ticket par son ID
export const getTicketById = async (id) => {
    const response = await api.get(`api/tickets/${id}`);
    return response.data;
};

// Annuler un ticket
export const cancelTicket = async (id) => {
    const response = await api.put(`api/tickets/${id}/cancel`);
    return response.data;
};

// Appeler un ticket
export const callTicket = async (id) => {
    const response = await api.put(`api/tickets/${id}/call`);
    return response.data;
};

// Marquer un ticket comme servi
export const serveTicket = async (id) => {
    const response = await api.put(`api/tickets/${id}/serve`);
    return response.data;
};

// Signaler une absence
export const noShowTicket = async (id) => {
    const response = await api.put(`api/tickets/${id}/no-show`);
    return response.data;
};
