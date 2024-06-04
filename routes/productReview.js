const express = require('express');
const router = express.Router();
const productReviewController = require('../controllers/productReviewController');
const passportjwt = require('../middleware/passportJWT')();


// Route to create a new product review
router.post('/',passportjwt.authenticate(), productReviewController.createProductReview);

// Route to get all reviews for a specific product
router.get('/:product_id', productReviewController.getProductReviews);

// Route to update a product review
router.put('/product-reviews/:review_id', productReviewController.updateProductReview);

// Route to delete a product review
router.delete('/product-reviews/:review_id', productReviewController.deleteProductReview);

module.exports = router;
