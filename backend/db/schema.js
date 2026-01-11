// schema.js
const { pool } = require('./dbConfig');

// Initialize database tables
const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    // 1. Create roles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 2. Create users table (updatedat included here)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        middleName VARCHAR(100),
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        age INT,
        sex ENUM('male', 'female', 'other'),
        educationalStatus VARCHAR(100),
        profession VARCHAR(100),
        country VARCHAR(100),
        region VARCHAR(100),
        zone VARCHAR(100),
        city VARCHAR(100),
        profilePhotoPath VARCHAR(255),
        donationAmount DECIMAL(10,2) DEFAULT 0,
        isPendingPayment BOOLEAN DEFAULT TRUE,
        roleId INT DEFAULT 2,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (roleId) REFERENCES roles(id)
      )
    `);
    
    // 3. Create payments table (updatedat included here)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        txRef VARCHAR(100) UNIQUE NOT NULL,
        transactionId VARCHAR(100),
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        receiptUrl VARCHAR(255),
        paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // 4. Insert default roles
    await connection.query(`
      INSERT IGNORE INTO roles (id, name, description) VALUES 
      (1, 'admin', 'Administrator with full access'),
      (2, 'user', 'Regular donor/user')
    `);
    
    connection.release();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initDb };