import api from './api';

const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

const getUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

const updateUser = async (userId, userData) => {
  const data = new FormData();

  Object.keys(userData).forEach(key => {
    if (key !== 'profilePhoto') {
      data.append(key, userData[key]);
    }
  });

  if (userData.profilePhoto instanceof File) {
    data.append('profilePhoto', userData.profilePhoto);
  }


  if (userData.roleId) {
    data.append('roleId', userData.roleId.toString());
  }

  try {
    const response = await api.put(`/admin/users/${userId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};