import httpInterceptor from './http-interceptor';
import { API_CONFIG } from '../config/api.config.js';

class PhotosService {
  async savePhoto(params) {
    try {
      const formData = new FormData();
      formData.append('id', params.id);
      formData.append('file', params.file);
      formData.append('title', params.title);
      formData.append('context', params.context);

      // Construire l'URL avec les paramètres
      const endpoint = API_CONFIG.ENDPOINTS.PHOTOS.SAVE
        .replace('{id}', params.id)
        .replace('{title}', params.title)
        .replace('{context}', params.context);

      const response = await httpInterceptor.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la photo:', error);
      throw error;
    }
  }

  async getPhoto(id, context) {
    try {
      // Construire l'URL avec les paramètres
      const endpoint = API_CONFIG.ENDPOINTS.PHOTOS.GET.replace('{fileName}', `${context}_${id}`);
      const response = await httpInterceptor.get(endpoint);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la photo:', error);
      return null;
    }
  }

  async deletePhoto(id, context) {
    try {
      // Construire l'URL avec les paramètres
      const endpoint = API_CONFIG.ENDPOINTS.PHOTOS.DELETE.replace('{id}', id);
      const response = await httpInterceptor.delete(endpoint);
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      throw error;
    }
  }
}

export { PhotosService };

