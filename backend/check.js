const { pool } = require('./db/dbConfig');

async function setupDatabase() {
  try {
    // Example: Replace this with your actual table schema
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(255)
      );
    `;
    await pool.query(createTableQuery);
    console.log("✅ Tables created or already exist!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Setup failed:", err.message);
    process.exit(1);
  }
}

setupDatabase();