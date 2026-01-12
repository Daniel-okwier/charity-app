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

const { initDb } = require('./db/schema');
const { createInitialAdmin } = require('./services/authService');

const app = express();
const PORT = process.env.PORT || 10000;

// MIDDLEWARE
// ALLOWED_ORIGIN should be your Vercel URL (added in Render Env Vars)
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*', 
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// STARTUP LOGIC (Port First for Render)
const initApp = async () => {
  // 1. Open Port Immediately
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server binding successful! Port: ${PORT}`);
  });

  try {
    // 2. Folder Setup
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // 3. Database Setup in Background
    console.log('⏳ Running background DB initialization...');
    await initDb();
    await createInitialAdmin(); 
    console.log('✅ Full system initialization complete');

  } catch (error) {
    console.error('⚠️ Startup Warning:', error.message);
  }
};

initApp();

module.exports = app;