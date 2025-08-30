import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

export const createUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/utilisateurs/create`, user, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await createUser(userData);
        return {
            success: true,
            data: response,
            message: 'Utilisateur créé avec succès'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Erreur lors de l\'inscription',
            status: error.response?.status
        };
    }
};