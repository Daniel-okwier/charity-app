import api from './api';

/**
 * Initialize a new payment with Chapa
 */
const initializePayment = async (paymentData) => {
  try {
    
    const transformedData = {
      amount: paymentData.amount,
      email: paymentData.email,
      first_name: paymentData.firstName, 
      last_name: paymentData.lastName    
    };

    const response = await api.post('/payments/initialize', transformedData);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return {
      status: 'success',
      data: {
        checkoutUrl: response.data.data?.checkoutUrl || response.data.data?.checkout_url,
        txRef: response.data.data?.txRef || response.data.data?.tx_ref
      }
    };
  } catch (error) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Payment initialization failed');
  }
};

/**
 * Verify payment status
 */
const verifyPayment = async (tx_ref) => {
  const response = await api.get(`/payments/verify/${tx_ref}`);
  return response.data;
};

/**
 * Create a payment record in the database
 */
const createPaymentRecord = async (payment) => {
  const response = await api.post('/payments', payment);
  return response.data;
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (txRef, status) => {
  const response = await api.put(`/payments/${txRef}/status`, { status });
  return response.data;
};

/**
 * Get payment by transaction reference
 */
const getPaymentByTxRef = async (txRef) => {
  const response = await api.get(`/payments/${txRef}`);
  return response.data;
};

/**
 * Get payment history for the authenticated user
 */
const getUserPayments = async () => {
  const response = await api.get('/payments/history');
  return response.data;
};

/**
 * Get all payments for admin view
 */
const getAllPayments = async () => {
  const response = await api.get('/payments/admin/all');
  return response.data;
};



const paymentService = {
  initializePayment,
  verifyPayment,
  createPaymentRecord,
  updatePaymentStatus,
  getPaymentByTxRef,
  getUserPayments,
  getAllPayments,
  
};

export default paymentService;