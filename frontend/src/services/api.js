import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, role, organizationId) => 
    api.post('/auth/register', { email, password, role, organizationId }),
  me: () => api.get('/auth/me'),
};

export const serviceAPI = {
  getPublicServices: (orgSlug) => api.get(`/services/public?org=${orgSlug}`),
  getServices: () => api.get('/services'),
  createService: (name) => api.post('/services', { name }),
  updateService: (id, updates) => api.put(`/services/${id}`, updates),
  updateServiceStatus: (id, status) => api.patch(`/services/${id}/status`, { status }),
  deleteService: (id) => api.delete(`/services/${id}`),
  getStatusHistory: (id) => api.get(`/services/${id}/history`),
};

export const incidentAPI = {
  getPublicIncidents: (orgSlug) => api.get(`/incidents/public?org=${orgSlug}`),
  getIncidents: () => api.get('/incidents'),
  createIncident: (title, description, serviceIds) => 
    api.post('/incidents', { title, description, serviceIds }),
  updateIncident: (id, updates) => api.put(`/incidents/${id}`, updates),
  addIncidentUpdate: (id, message) => api.post(`/incidents/${id}/updates`, { message }),
  resolveIncident: (id) => api.patch(`/incidents/${id}/resolve`),
  
  getPublicMaintenances: (orgSlug) => api.get(`/incidents/maintenances/public?org=${orgSlug}`),
  getMaintenances: () => api.get('/incidents/maintenances'),
  createMaintenance: (title, description, serviceIds, scheduledStart, scheduledEnd) =>
    api.post('/incidents/maintenances', { title, description, serviceIds, scheduledStart, scheduledEnd }),
};

export default api;