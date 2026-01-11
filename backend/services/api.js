const axios = require('axios');
require('dotenv').config();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
if (!CHAPA_SECRET_KEY) {
  throw new Error('CHAPA_SECRET_KEY is not set in environment variables');
}

// Create axios instance with default config for LIVE mode
const api = axios.create({
  baseURL: 'https://api.chapa.co', 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error Response:', error.response?.data || 'No response data');
    return Promise.reject(error);
  }
);

module.exports = api;