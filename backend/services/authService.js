const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config(); 

// Connection pool with Aiven-specific settings
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Ensure this matches your Render Env Var name
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 20990,
  ssl: {
    rejectUnauthorized: false // Required for Aiven
  },
  waitForConnections: true,
  connectionLimit: 5, // Lower limit is safer for shared/free tiers
  connectTimeout: 30000,
});

// Check if user exists by email
const checkIfUserExists = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking user existence:', error.message);
    throw error;
  }
};

// Create a new user
const createUser = async (userData, profilePhotoPath) => {
  try {
    if (!userData.password) throw new Error('Password is required');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const roleId = 2; 
    
    const [result] = await pool.query(
      `INSERT INTO users 
       (firstName, middleName, lastName, email, password, phone, age, sex, 
       educationalStatus, profession, country, region, zone, city, profilePhotoPath, donationAmount, roleId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.firstName, userData.middleName || null, userData.lastName,
        userData.email, hashedPassword, userData.phone || null,
        userData.age || null, userData.sex || null, userData.educationalStatus || null,
        userData.profession || null, userData.country || null, userData.region || null,
        userData.zone || null, userData.city || null, profilePhotoPath,
        userData.donationAmount || 0, roleId
      ]
    );

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return user[0];
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

// User login
const logIn = async (userData) => {
  try {
    const [users] = await pool.query(
      'SELECT users.*, roles.name as roleName FROM users JOIN roles ON users.roleId = roles.id WHERE email = ?',
      [userData.email]
    );

    if (users.length === 0) return { status: 'fail', message: 'User not found' };
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) return { status: 'fail', message: 'Invalid password' };

    return {
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        roleName: user.roleName,
        donationAmount: user.donationAmount,
        isPendingPayment: user.isPendingPayment
      }
    };
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

// Create initial admin user
const createInitialAdmin = async () => {
  try {
    const [admins] = await pool.query('SELECT * FROM users WHERE roleId = 1 LIMIT 1');
    if (admins.length > 0) {
      console.log('ℹ️ Admin user already exists');
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const emailExists = await checkIfUserExists(adminEmail);
    if (emailExists) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await pool.query(
      `INSERT INTO users (firstName, lastName, email, password, roleId, isPendingPayment)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Admin', 'User', adminEmail, hashedPassword, 1, 0]
    );
    console.log('✅ Initial admin user created successfully');
  } catch (error) {
    console.error('❌ Error creating initial admin:', error.message);
  }
};

module.exports = { pool, checkIfUserExists, createUser, logIn, createInitialAdmin };