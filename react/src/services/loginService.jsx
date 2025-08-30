import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        });
        return {
            success: true,
            data: response.data,
            message: 'Connexion réussie'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Erreur lors de la connexion',
            status: error.response?.status
        };
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        });
        return {
            success: true,
            message: 'Déconnexion réussie'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Erreur lors de la déconnexion'
        };
    }
};

