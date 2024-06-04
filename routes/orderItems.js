const express = require('express');
const router = express.Router();

const {
    createOrderItems,
    updateOrderItems,
    deleteOrderItems,
} = require('../controllers/orderItemsController');

router.post('/', createOrderItems);
router.put('/:orderItemId', updateOrderItems);
router.delete('/:orderItemId', deleteOrderItems);

module.exports = router;
