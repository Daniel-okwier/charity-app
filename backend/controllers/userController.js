const userService = require('../services/userService');
const fs = require('fs');

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const userData = await userService.getUserById(userId);
    
    if (!userData) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Remove sensitive information
    delete userData.password;
    
    res.status(200).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve user information: ' + error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; 
    const { firstName, lastName, email } = req.body;
    const profilePhoto = req.file;

    // Create update object with only allowed fields
    const updateData = {
      firstName,
      lastName,
      email
    };

    // Handle file upload
    if (profilePhoto) {
      updateData.profilePhotoPath = `uploads/${profilePhoto.filename}`;
    }
    
    const updatedUser = await userService.updateUser(userId, updateData);
    
    if (!updatedUser) {
      if (profilePhoto) fs.unlinkSync(profilePhoto.path);
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Remove sensitive data before sending response
    delete updatedUser.password;

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      status: 'error',
      message: error.message.includes('ER_BAD_FIELD_ERROR') 
        ? 'Invalid profile update request'
        : 'Failed to update profile: ' + error.message
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUserProfile
};