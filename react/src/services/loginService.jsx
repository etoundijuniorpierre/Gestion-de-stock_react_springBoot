import httpInterceptor from "./http-interceptor";

export const loginUser = async (credentials) => {
    // Endpoint principal identifié dans swagger.json
    const endpoint = '/api/gestionDeStock/authenticate';
    
    try {
        console.log(`🔐 Tentative de connexion avec l'endpoint: ${endpoint}`);
        
        // Format exact selon swagger.json : { "login": "...", "password": "..." }
        const authData = {
            login: credentials.email,
            password: credentials.password
        };
        
        console.log(`📝 Données d'authentification:`, authData);
        const data = await httpInterceptor.post(endpoint, authData);
        
        // Stocker le token selon swagger.json : { "accessToken": "..." }
        if (data.accessToken) {
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify({ email: credentials.email }));
        }
        
        console.log(`✅ Connexion réussie avec l'endpoint: ${endpoint}`);
        return {
            success: true,
            data: data,
            message: 'Connexion réussie'
        };
    } catch (error) {
        console.log(`❌ Échec de connexion:`, error.message);
        return {
            success: false,
            error: error.message || 'Erreur lors de la connexion',
            status: error.status || 500
        };
    }
};

export const logoutUser = async () => {
    try {
        // Note: Pas d'endpoint logout dans swagger.json, on nettoie juste le localStorage
        console.log('🔓 Déconnexion - nettoyage du localStorage');
        
        // Nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        return {
            success: true,
            message: 'Déconnexion réussie'
        };
    } catch (error) {
        // Même en cas d'erreur, nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        return {
            success: false,
            error: error.message || 'Erreur lors de la déconnexion'
        };
    }
};

