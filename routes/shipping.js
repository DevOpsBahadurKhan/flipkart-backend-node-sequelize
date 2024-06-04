const express = require('express');
const ShippingController = require('../controllers/shippingController');
const passportjwt = require('../middleware/passportJWT')(); // Assume this is your JWT-based authentication middleware

const router = express.Router();

// Route to get all shipping methods
router.get('/methods', passportjwt.authenticate(), ShippingController.getShippingMethods);

// Route to get shipping details for an order
router.get('/order/:order_id', passportjwt.authenticate(), ShippingController.getOrderShipping);

// Route to create a new shipping method
router.post('/methods', passportjwt.authenticate(), ShippingController.createShippingMethod);

module.exports = router;
