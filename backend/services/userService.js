const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME  
});

const getUserById = async (userId) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.firstName, 
        u.lastName, 
        u.email, 
        u.profilePhotoPath,
        u.roleId,
        r.name as roleName,
        u.createdAt, 
        u.updatedAt 
      FROM users u
      LEFT JOIN roles r ON u.roleId = r.id
      WHERE u.id = ?`, 
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error('Database query failed');
  }
};

const updateUser = async (userId, userData) => {
  try {
    // Filter out undefined/null values
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== null && v !== undefined)
    );

    // Prepare SET clause
    const setClause = Object.keys(filteredData)
      .map(key => `${key} = ${pool.escape(filteredData[key])}`)
      .join(', ');

    if (!setClause) {
      throw new Error('No valid fields to update');
    }

    const query = `
      UPDATE users 
      SET ${setClause}, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    await pool.query(query, [userId]);
    return await getUserById(userId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = {
  getUserById,
  updateUser
};