const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Apply auth middleware to all payment routes
router.use(authMiddleware);

// Payment routes
router.post('/initialize', paymentController.initializePayment);
router.get('/verify/:tx_ref', paymentController.verifyPayment);
router.get('/history', paymentController.getPaymentHistory); 
router.get('/:tx_ref', paymentController.getPaymentByTxRef);
router.put('/:tx_ref/status', paymentController.updatePayment);



// Get all payments (accessible by any authenticated user)
router.get('/admin/all', paymentController.getAllPayments); 

module.exports = router;