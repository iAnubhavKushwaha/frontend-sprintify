// client/src/services/projectService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = async () => {
  try {
    console.log('📁 Fetching projects...');
    const response = await axios.get(`${API_URL}/projects`);
    console.log('📁 Projects response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    console.log('✅ Creating project:', projectData);
    const response = await axios.post(`${API_URL}/projects`, projectData);
    console.log('✅ Project created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating project:', error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    console.log('📁 Fetching project by ID:', projectId);
    const response = await axios.get(`${API_URL}/projects/${projectId}`);
    console.log('📁 Project details:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    throw error;
  }
};

export const updateProject = async (projectId, updateData) => {
  try {
    console.log('🔄 Updating project:', projectId, updateData);
    const response = await axios.put(`${API_URL}/projects/${projectId}`, updateData);
    console.log('🔄 Project updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    console.log('🗑️ Deleting project:', projectId);
    const response = await axios.delete(`${API_URL}/projects/${projectId}`);
    console.log('🗑️ Project deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    throw error;
  }
};