const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const passportjwt = require('../middleware/passportJWT')();

router.post('/', passportjwt.authenticate(), orderController.createOrderFromCart);
router.get('/:order_id', passportjwt.authenticate(), orderController.getOrder);
router.get('/', passportjwt.authenticate(), orderController.getAllOrders);

module.exports = router;
