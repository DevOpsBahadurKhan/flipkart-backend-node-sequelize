const express = require('express');
const WishlistController = require('../controllers/wishlistController');
const passportjwt = require('../middleware/passportJWT')();

const router = express.Router();

// Route to add a product to the wishlist
router.post('/', passportjwt.authenticate(), WishlistController.addToWishlist);

// Route to remove a product from the wishlist
router.delete('/', passportjwt.authenticate(), WishlistController.removeFromWishlist);

// Route to get all products in a user's wishlist
router.get('/:user_id', passportjwt.authenticate(), WishlistController.getUserWishlist); // Assuming userId is a parameter


module.exports = router;
