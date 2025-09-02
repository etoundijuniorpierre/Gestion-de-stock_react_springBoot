import httpInterceptor from "./http-interceptor";

export const createUser = async (entreprise) => {
    try {
        return await httpInterceptor.post('/api/gestionDeStock/entreprises/create', entreprise);
    } catch (error) {
        console.error('Erreur lors de la création de l\'entreprise:', error);
        throw error;
    }
};

export const registerUser = async (entrepriseData) => {
    try {
        const response = await createUser(entrepriseData);
        return {
            success: true,
            data: response,
            message: 'Entreprise créée avec succès'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Erreur lors de l\'inscription',
            status: error.response?.status
        };
    }
};