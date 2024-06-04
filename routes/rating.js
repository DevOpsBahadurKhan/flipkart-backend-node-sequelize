const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Route to create a new rating
router.post('/', ratingController.createRating);

// Route to get all ratings
router.get('/', ratingController.getRatings);


module.exports = router;
