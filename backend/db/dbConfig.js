const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * Database connection pool configuration.
 * Using individual variables ensures no URL parsing errors 
 * and handles Aiven's required SSL connection.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Make sure this matches your .env key
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 20990,
  ssl: {
    // Required for Aiven and most cloud MySQL providers
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds timeout for cloud stability
});

// Test the connection immediately on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to the Aiven MySQL database successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

testConnection();

module.exports = { pool };