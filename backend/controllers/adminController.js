const adminService = require('../services/adminService');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get all stats from admin service
    const stats = await adminService.getDashboardStats();
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard statistics'
    });
  }
};

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    
    // Remove sensitive information
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      status: 'success',
      data: sanitizedUsers
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve users'
    });
  }
};

// Get user by ID (for admin)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await adminService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      status: 'success',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve user'
    });
  }
};

// Update user (for admin)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const profilePhoto = req.file;
    
    // Check if user exists
    const existingUser = await adminService.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Process profile photo if uploaded
    if (profilePhoto) {
      userData.profilePhotoPath = `uploads/${profilePhoto.filename}`;
    }

    // Convert roleId to number if it exists
    if (userData.roleId) {
      userData.roleId = parseInt(userData.roleId);
    }
    
    const updatedUser = await adminService.updateUser(userId, userData);
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update user'
    });
  }
};

// Delete user (for admin)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const existingUser = await adminService.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    await adminService.deleteUser(userId);
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};