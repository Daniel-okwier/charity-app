const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Get all users (for admin)
const getAllUsers = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT u.*, r.name as roleName FROM users u JOIN roles r ON u.roleId = r.id ORDER BY u.createdAt DESC'
    );
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const [rows] = await pool.query(
      'SELECT u.*, r.name as roleName FROM users u JOIN roles r ON u.roleId = r.id WHERE u.id = ?',
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Update user 
const updateUser = async (userId, userData) => {
  try {
    let query = 'UPDATE users SET ';
    const queryParams = [];
    const updates = [];

    Object.keys(userData).forEach((key) => {
      if (key === 'password' && userData.password) {
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        updates.push(`${key} = ?`);
        queryParams.push(hashedPassword);
      } else if (key !== 'id' && userData[key] !== undefined) {
        updates.push(`${key} = ?`);
        queryParams.push(userData[key]);
      }
    });

    if (updates.length === 0) {
      return getUserById(userId); // No updates needed
    }

    query += updates.join(', ');
    query += ' WHERE id = ?';
    queryParams.push(userId);

    await pool.query(query, queryParams);
    return getUserById(userId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


// Delete user
const deleteUser = async (userId) => {
  try {
    await pool.query('DELETE FROM payments WHERE userId = ?', [userId]);
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get dashboard statistics
const getDashboardStats = async () => {
  try {
    // Get total users
    const [totalUsersResult] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const totalUsers = totalUsersResult[0].totalUsers;
    
    // Get total donations and donors
    const [donationStats] = await pool.query(
      `SELECT 
        SUM(amount) as totalDonations,
        COUNT(DISTINCT userId) as totalDonors
       FROM payments 
       WHERE status = 'completed'`
    );
    
    // Get recent payments with user info
    const [recentPayments] = await pool.query(
      `SELECT p.*, u.firstName, u.lastName, u.email 
       FROM payments p 
       JOIN users u ON p.userId = u.id 
       WHERE p.status = 'completed'
       ORDER BY p.paymentDate DESC 
       LIMIT 10`
    );
    
    return {
      totalUsers,
      totalDonations: donationStats[0].totalDonations || 0,
      totalDonors: donationStats[0].totalDonors || 0,
      recentPayments
    };
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats
};