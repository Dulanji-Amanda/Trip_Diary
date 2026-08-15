import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const profileService = {
    getUser: (id) => api.get(`/profiles/${id}`),
    getUserByEmail: (email) => api.get(`/profiles/email/${email}`),
    createUser: (data) => api.post('/profiles', data),
    getFavorites: (userId) => api.get(`/profiles/${userId}/favorites`),
    addFavorite: (userId, destId) => api.post(`/profiles/${userId}/favorites?destinationId=${destId}`),
    getVisitedPlaces: (userId) => api.get(`/profiles/${userId}/visited`),
};

export const destinationService = {
    getAll: (tag) => api.get('/destinations' + (tag ? `?tag=${tag}` : '')),
    getById: (id) => api.get(`/destinations/${id}`),
    create: (data) => api.post('/destinations', data),
    update: (id, data) => api.put(`/destinations/${id}`, data),
    delete: (id) => api.delete(`/destinations/${id}`),
    
    getBlogs: (destId) => api.get(`/destinations/${destId}/blogs`),
    getBlogsByUser: (userId) => api.get(`/blogs/user/${userId}`),
    createBlog: (data) => api.post('/blogs', data),
    updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
    deleteBlog: (id) => api.delete(`/blogs/${id}`),
    
    getReviews: (destId) => api.get(`/destinations/${destId}/reviews`),
    addReview: (destId, data) => api.post(`/destinations/${destId}/reviews`, data),
    updateReview: (id, data) => api.put(`/reviews/${id}`, data),
    deleteReview: (id) => api.delete(`/reviews/${id}`),
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
