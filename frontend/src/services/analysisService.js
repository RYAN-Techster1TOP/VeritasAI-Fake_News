import api from './api.js';

export const analyzeText = (text) => api.post('/analysis/text', { text });

export const analyzeUrl = (url) => api.post('/analysis/url', { url });

export const analyzeImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post('/analysis/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getHistory = () => api.get('/analysis/history');

export const getAnalysis = (id) => api.get(`/analysis/${id}`);
