import httpInterceptor from "./http-interceptor";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth.service";

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
            
            // Récupérer les informations complètes de l'utilisateur via findByEmail
            console.log(`🔍 Récupération des informations utilisateur pour: ${credentials.email}`);
            const userService = new UserService();
            const userInfo = await userService.findByEmail(credentials.email);
            
            if (userInfo) {
                console.log(`✅ Informations utilisateur récupérées:`, userInfo);
                
                // Stocker les informations complètes de l'utilisateur
                localStorage.setItem('connectedUser', JSON.stringify(userInfo));
                localStorage.setItem('id', userInfo.id);
                localStorage.setItem('idUser', userInfo.id);
                localStorage.setItem('entrepriseId', userInfo.entreprise?.id || userInfo.idEntreprise);
                localStorage.setItem('username', userInfo.nom || userInfo.prenom || userInfo.email);
                localStorage.setItem('role', userInfo.role || 'USER');
                
                console.log(`💾 Données utilisateur stockées dans localStorage:`, {
                    id: userInfo.id,
                    idUser: userInfo.id,
                    entrepriseId: userInfo.entreprise?.id || userInfo.idEntreprise,
                    username: userInfo.nom || userInfo.prenom || userInfo.email,
                    role: userInfo.role || 'USER'
                });
            } else {
                console.warn(`⚠️ Aucune information utilisateur trouvée pour: ${credentials.email}`);
            }
        }
        
        console.log(`✅ Connexion réussie avec l'endpoint: ${endpoint}`);
        return {
            success: true,
            data: data,
            message: 'Connexion réussie'
        };
    } catch (error) {
        console.log(`❌ Échec de connexion:`, error.message);
        // Make sure to clear any potentially invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('connectedUser');
        localStorage.removeItem('id');
        localStorage.removeItem('idUser');
        localStorage.removeItem('entrepriseId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        
        return {
            success: false,
            error: error.message || 'Erreur lors de la connexion',
            status: error.status || 500
        };
    }
};

export const logoutUser = async () => {
    try {
        // Use AuthService for consistent logout handling with the new endpoint
        const authService = new AuthService();
        await authService.logout();
        
        console.log('✅ Déconnexion réussie');
        
        return {
            success: true,
            message: 'Déconnexion réussie'
        };
    } catch (error) {
        console.log('✅ Déconnexion effectuée (erreur lors du processus):', error.message);
        
        return {
            success: false,
            error: error.message || 'Erreur lors de la déconnexion'
        };
    }
};