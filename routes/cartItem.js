const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');

const passportjwt = require('../middleware/passportJWT')();

router.post('/', passportjwt.authenticate(), cartItemController.createCartItem);
router.patch('/:cartItemId', passportjwt.authenticate(), cartItemController.updateCartItem);
router.delete('/:cartItemId', passportjwt.authenticate(), cartItemController.deleteCartItem);

module.exports = router;
