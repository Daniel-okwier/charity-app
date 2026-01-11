import api from './api';

/**
 * Get the current user's profile
 * 
 * @returns {Promise} - Response with user data
 */
const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/**
 * Update the current user's profile
 * 
 * @param {Object} userData - User profile data
 * @returns {Promise} - Response with updated user data
 */
const updateUserProfile = async (userData) => {
  const formData = new FormData();
  
  // Append all fields
  if (userData.firstName) formData.append('firstName', userData.firstName);
  if (userData.lastName) formData.append('lastName', userData.lastName);
  if (userData.email) formData.append('email', userData.email);
  
  // Only append photo if it exists and is a File
  if (userData.profilePhoto && userData.profilePhoto instanceof File) {
    formData.append('profilePhoto', userData.profilePhoto);
  }

  const response = await api.put('/users/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  
  return response.data;
};

const userService = {
  getCurrentUser,
  updateUserProfile
};

export default userService;