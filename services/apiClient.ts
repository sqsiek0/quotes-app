import axios from 'axios';
import { API_BASE_URL } from '../constants/api/Api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response;
    },
    (error) => {
        // Handle error response
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error: No response received');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);