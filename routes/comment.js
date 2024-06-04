const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');



// Route to create a new comment
router.post('/', commentController.createComment);

// Route to get all comments
router.get('/', commentController.getComments);

module.exports = router;
