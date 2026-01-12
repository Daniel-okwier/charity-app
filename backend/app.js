const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); 
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { initDb } = require('./db/schema');
const { createInitialAdmin } = require('./services/authService');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// New initialization logic: Listen FIRST, then setup DB
const initApp = async () => {
  // 1. Tell Render we are alive by binding the port immediately
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server binding successful. Listening on port ${PORT}`);
  });

  try {
    // 2. Setup local directories
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // 3. Initialize Database in the background
    console.log('⏳ Initializing database tables...');
    await initDb();
    
    console.log('⏳ Setting up initial admin...');
    await createInitialAdmin(); 
    
    console.log('✅ All systems ready');
  } catch (error) {
    // We log the error but don't crash, so the server stays "up" on Render
    console.error('⚠️ Background initialization failed:', error.message);
  }
};

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', database: 'connected' });
});

// Start the sequence
initApp();

module.exports = app;