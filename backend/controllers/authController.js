const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Handle member login
async function logIn(req, res, next) {
  try {
    const userData = req.body;
    const user = await authService.logIn(userData);
    
    if (user.status === "fail") {
      return res.status(403).json({
        status: user.status,
        message: user.message,
      });
    }

    const payload = {
      user_id: user.data.id,
      email: user.data.email,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      roleId: user.data.roleId,
      donationAmount: user.data.donationAmount
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
    
    const sendBack = {
      token: token,
      id: user.data.id,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      email: user.data.email,
      roleId: user.data.roleId,
      roleName: user.data.roleName,
      donationAmount: user.data.donationAmount,
      isPendingPayment: user.data.isPendingPayment
    };
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: sendBack,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

// Register a new user
async function register(req, res, next) {
  try {
    const userData = req.body; 
    const image = req.file; 

    // Check required fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
      return res.status(400).json({
        error: "First name, last name, email, and password are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({
        error: "Invalid email format"
      });
    }

    // Check password length
    if (userData.password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      });
    }

    const userExists = await authService.checkIfUserExists(userData.email);
    if (userExists) {
      return res.status(400).json({
        error: "This email address is already associated with another user!"
      });
    }

    // Process the image if uploaded
    let imagePath = null;
    if (image) {
      imagePath = `uploads/${image.filename}`;
    }

    // Convert donationAmount to number if it exists
    if (userData.donationAmount) {
      userData.donationAmount = parseFloat(userData.donationAmount) || 0;
    }

    // Create the user
    const user = await authService.createUser(userData, imagePath);

    // Return success response
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        roleId: user.roleId
      }
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error during registration"
    });
  }
}

// Export the functions
module.exports = {
  logIn,
  register
};