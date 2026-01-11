const paymentService = require('../services/paymentService');
const userService = require('../services/userService');

// Initialize payment
const initializePayment = async (req, res) => {
    try {
        console.log('Received payment data:', req.body);
        
        // Validate required fields
        const requiredFields = ['amount', 'email', 'first_name', 'last_name'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const { userId } = req.user;
        const { amount, email, first_name, last_name } = req.body;

        const tx_ref = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const paymentData = await paymentService.initializePayment({
            amount,
            email,
            first_name,
            last_name,
            tx_ref
        });
        
        await paymentService.createPaymentRecord({
            userId,
            amount,
            txRef: tx_ref,
            status: 'pending'
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Payment initialized successfully',
            data: {
                checkoutUrl: paymentData.data.checkout_url,
                txRef: tx_ref
            }
        });
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to initialize payment',
            details: error.response?.data || null
        });
    }
};
// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // Call Chapa API to verify payment
    const verificationData = await paymentService.verifyPayment(tx_ref);
    console.log('Verification data:', verificationData); // Log payment verification response

    if (verificationData.status === 'success') {
      console.log('Updating payment status to completed for tx_ref:', tx_ref);
      await paymentService.updatePaymentStatus(tx_ref, 'completed'); // Update status
      console.log('Payment status updated successfully.');

      return res.status(200).json({
        status: 'success',
        message: 'Payment verification completed',
        data: verificationData.data
      });
    } else {
      console.log('Payment verification failed for tx_ref:', tx_ref);
      await paymentService.updatePaymentStatus(tx_ref, 'failed');
      return res.status(400).json({
        status: 'fail',
        message: 'Payment verification failed. Please try again.'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error); // Log any errors
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// Get payment history for a user
const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.user; 

    const paymentHistory = await paymentService.getUserPayments(userId);

    res.status(200).json({
      status: 'success',
      data: paymentHistory
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve payment history',
      error: error.message
    });
  }
};

// Update payment status by transaction reference
const updatePayment = async (req, res) => {
  try {
    const { txRef, status } = req.body;

    await paymentService.updatePaymentStatus(txRef, status);

    res.status(200).json({
      status: 'success',
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

// Get payment by transaction reference
const getPaymentByTxRef = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const payment = await paymentService.getPaymentByTxRef(tx_ref);

    if (!payment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment by transaction reference:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve payment',
      error: error.message
    });
  }
};


const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();

    res.status(200).json({
      status: 'success',
      data: payments
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve all payments',
      error: error.message
    });
  }
};



module.exports = {
  initializePayment,
  verifyPayment,
  getPaymentHistory,
  updatePayment,
  getPaymentByTxRef,
  getAllPayments,
};