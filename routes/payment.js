const express = require('express');
const PaymentController = require('../controllers/paymentController');
const passportjwt = require('../middleware/passportJWT')();

const router = express.Router();

// Route to get all payment methods
router.get('/methods', passportjwt.authenticate(), PaymentController.getPaymentMethods);

// Route to get payments for a specific order
router.get('/order/:order_id', passportjwt.authenticate(), PaymentController.getOrderPayments);

// Route to create a new payment
router.post('/', passportjwt.authenticate(), PaymentController.createPayment);

module.exports = router;
