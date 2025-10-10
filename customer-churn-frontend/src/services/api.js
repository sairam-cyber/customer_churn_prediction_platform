import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/login', credentials);
export const signup = (data) => api.post('/signup', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const getDashboardData = () => api.post('/dashboard');
export const getPerformanceData = () => api.post('/performance');
export const predictChurn = (data) => api.post('/predict', data);
export const getChurnFactors = () => api.post('/churn_factors');
export const getSegmentationData = () => api.post('/segmentation');
export const retrainModel = (data) => api.post('/retrain', data);


// Functions for user settings
export const getUserDetails = () => api.get('/user');
export const updateUserDetails = (data) => api.put('/user/update', data);
export const startCompanyVerification = (data) => api.post('/user/verify/start', data);

export default api;