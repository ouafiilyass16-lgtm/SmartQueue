
import api from "./api";

// Récupérer toutes les files d'attente
export const getQueues = async () => {
    const response = await api.get("/api/queues");
    return response.data;
};

// Récupérer une file par son ID
export const getQueueById = async (id) => {
    const response = await api.get(`/api/queues/${id}`);
    return response.data;
};

// Créer une file d'attente

 // Créer une file d'attente
export const createQueue = async (name) => {
    const response = await api.post("/api/queues", null, {
        params: { name: name }
    });

    return response.data;
};


// Fermer une file
export const closeQueue = async (id) => {
    const response = await api.put(`/api/queues/${id}/close`);
    return response.data;
};

// Ouvrir une file
export const openQueue = async (id) => {
    const response = await api.put(`/api/queues/${id}/open`);
    return response.data;
};

// Supprimer une file
export const deleteQueue = async (id) => {
    const response = await api.delete(`/api/queues/${id}`);
    return response.data;
};
