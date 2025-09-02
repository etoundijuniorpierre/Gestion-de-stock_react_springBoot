import httpInterceptor from './http-interceptor';

class PhotosService {
  async savePhoto(params) {
    try {
      const formData = new FormData();
      formData.append('id', params.id);
      formData.append('file', params.file);
      formData.append('title', params.title);
      formData.append('context', params.context);

      const response = await httpInterceptor.post('/api/gestionDeStock/photos/save', formData, {
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
      const response = await httpInterceptor.get(`/api/gestionDeStock/photos/${context}/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la photo:', error);
      return null;
    }
  }

  async deletePhoto(id, context) {
    try {
      const response = await httpInterceptor.delete(`/api/gestionDeStock/photos/${context}/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      throw error;
    }
  }
}

export { PhotosService };
