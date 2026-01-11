const api = require('./api');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Initialize payment with Chapa
 */
const initializePayment = async ({ amount, email, first_name, last_name, tx_ref }) => {
  try {
    if (!amount || !email || !first_name || !last_name || !tx_ref) {
      throw new Error('Missing required payment information');
    }

    const formattedAmount = parseFloat(amount).toFixed(2);

    const response = await api.post('/v1/transaction/initialize', {
      amount: parseFloat(formattedAmount),
      currency: 'ETB',
      email,
      first_name,
      last_name,
      tx_ref,
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/verify`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`
    });
    
    return response.data;
  } catch (error) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Verify payment with Chapa
 */
const verifyPayment = async (tx_ref) => {
  try {
    const response = await api.get(`/v1/transaction/verify/${tx_ref}`);
    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a payment record in the database
 */
const createPaymentRecord = async (payment) => {
  const { userId, amount, txRef, status } = payment;
  
  const [result] = await pool.query(
    `INSERT INTO payments (userId, amount, txRef, status, paymentDate) 
     VALUES (?, ?, ?, ?, NOW())`,
    [userId, amount, txRef, status]
  );
  
  return {
    id: result.insertId,
    userId,
    amount,
    txRef,
    status,
    paymentDate: new Date()
  };
};

/**
 * Update payment status in the database
 */
const updatePaymentStatus = async (txRef, status) => {
  const query = `UPDATE payments SET status = ?, updatedAt = NOW() WHERE txRef = ?`;
  try {
    await pool.query(query, [status, txRef]);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Get payment by transaction reference
 */
const getPaymentByTxRef = async (txRef) => {
  const [rows] = await pool.query(
    'SELECT * FROM payments WHERE txRef = ?',
    [txRef]
  );
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Get payment history for a user
 */
const getUserPayments = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM payments WHERE userId = ? ORDER BY paymentDate DESC',
    [userId]
  );
  return rows;
};

/**
 * Get all payments (for admin)
 */
const getAllPayments = async () => {
  const [rows] = await pool.query(
    `SELECT p.*, u.firstName, u.lastName, u.email 
     FROM payments p 
     JOIN users u ON p.userId = u.id 
     ORDER BY p.paymentDate DESC`
  );
  return rows;
};

const getGatewayReceipt = async (tx_ref) => {
  try {
  
    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE txRef = ? LIMIT 1',
      [tx_ref]
    );

    if (payments.length === 0) {
      throw new Error('Payment not found in our records');
    }

    // 2. Get receipt URL from Chapa API
    const response = await chapaApi.get(`/transaction/receipt/${tx_ref}`);
    
    return {
      receiptUrl: response.data.receipt_url, // Using Chapa's direct URL
      chapaReference: tx_ref
    };
    
  } catch (error) {
    console.error('[Chapa Receipt Error]', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to retrieve official receipt'
    );
  }
};

const paymentService = {
  initializePayment,
  verifyPayment,
  createPaymentRecord,
  updatePaymentStatus,
  getPaymentByTxRef,
  getUserPayments,
  getAllPayments,
  getGatewayReceipt
};

module.exports = paymentService;