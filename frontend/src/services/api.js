import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Assuming a mocked user ID for demo purposes, since no Auth service is present
export const DEMO_USER_ID = 1;

export const profileService = {
    getUser: (id) => api.get(`/profiles/${id}`),
    createUser: (data) => api.post('/profiles', data),
    getFavorites: (userId) => api.get(`/profiles/${userId}/favorites`),
    addFavorite: (userId, destId) => api.post(`/profiles/${userId}/favorites?destinationId=${destId}`),
    getVisitedPlaces: (userId) => api.get(`/profiles/${userId}/visited`),
};

export const destinationService = {
    getAll: (tag) => api.get('/destinations' + (tag ? `?tag=${tag}` : '')),
    getById: (id) => api.get(`/destinations/${id}`),
    create: (data) => api.post('/destinations', data),
    
    getBlogs: (destId) => api.get(`/destinations/${destId}/blogs`),
    createBlog: (data) => api.post('/blogs', data),
    
    getReviews: (destId) => api.get(`/destinations/${destId}/reviews`),
    addReview: (destId, data) => api.post(`/destinations/${destId}/reviews`, data),
};

export const galleryService = {
    upload: (file, userId, destId) => {
        const formData = new FormData();
        formData.append('file', file);
        if (userId) formData.append('userId', userId);
        if (destId) formData.append('destinationId', destId);
        
        return api.post('/gallery/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getByDestination: (destId) => api.get(`/gallery/destination/${destId}`),
    getByUser: (userId) => api.get(`/gallery/user/${userId}`)
};

export default api;
