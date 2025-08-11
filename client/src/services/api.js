import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for long text processing
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const ttsAPI = {
  // Synthesize speech
  synthesize: async (data) => {
    const response = await api.post('/tts/synthesize', data);
    return response.data;
  },

  // Generate preview
  preview: async (data) => {
    const response = await api.post('/tts/preview', data);
    return response.data;
  },

  // Get synthesis status
  getStatus: async (id) => {
    const response = await api.get(`/tts/status/${id}`);
    return response.data;
  },
};

export const enginesAPI = {
  // Get all available engines
  getAll: async () => {
    const response = await api.get('/engines');
    return response.data;
  },

  // Check engine availability
  checkAvailability: async (engineName) => {
    const response = await api.get(`/engines/${engineName}/check`);
    return response.data;
  },
};

export const languagesAPI = {
  // Get all supported languages
  getAll: async () => {
    const response = await api.get('/languages');
    return response.data;
  },

  // Get languages for specific engine
  getForEngine: async (engineName) => {
    const response = await api.get(`/languages/${engineName}`);
    return response.data;
  },
};

export default api;
