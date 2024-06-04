const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const passportjwt = require('../middleware/passportJWT')();


router.post('/', passportjwt.authenticate(), cartController.addToCart);
router.delete('/:cartItemId', passportjwt.authenticate(), cartController.removeFromCart);
router.get('/', passportjwt.authenticate(), cartController.getCart);

module.exports = router;
