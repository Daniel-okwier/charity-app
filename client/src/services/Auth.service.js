import api from './api';

/**
 * Register a new user
 * 
 * @param {Object} formData - User registration data
 * @returns {Promise} - Response with user data
 */
const register = async (formData) => {
  try {
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error; 
  }
};

/**
 * Log in a user
 * 
 * @param {Object} formData - User login credentials
 * @returns {Promise} - Response with user data and token
 */
const login = async (formData) => {
  const response = await api.post('/auth/login', formData);
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;