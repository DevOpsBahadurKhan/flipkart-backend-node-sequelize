const express = require('express');
const {
    createCategory,
    listCategories,
    getSubSubCategories,
    filterCategories
} = require('../controllers/categoryController');

const { hasCategoryName } = require('../validators/validators');
const router = express.Router();

// Route to create a category
router.post('/', hasCategoryName, createCategory);
router.get('/', listCategories);
router.get('/:parentCategoryId/subcategories', getSubSubCategories);

// Define a route to filter categories based on query parameters
router.get('/filter', filterCategories);


module.exports = router;
