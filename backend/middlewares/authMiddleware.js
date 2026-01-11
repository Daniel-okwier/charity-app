const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    req.user = {
      userId: decoded.user_id,
      email: decoded.email,
      roleId: decoded.roleId
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token: ' + error.message
    });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user && req.user.roleId === 1) {
      next();
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: admin privileges required'
      });
    }
  });
};

module.exports = {
  authMiddleware,
  isAdmin
};