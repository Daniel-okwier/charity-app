const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); 
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import database initialization and admin creation
const { initDb } = require('./db/schema');
const { createInitialAdmin } = require('./services/authService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files - Pointing to the 'uploads' folder in the current directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database and create initial admin
const initApp = async () => {
  try {
    // Ensure uploads directory exists at startup
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('Uploads directory created');
    }

    await initDb();
    await createInitialAdmin(); 
    console.log('Admin setup completed');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint (Used by Render to monitor your app)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the app
initApp();

module.exports = app;