const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // Import multer configuration
const authorize = require('../middleware/authorization');
const passportjwt = require('../middleware/passportJWT')();

const {
    createProduct,
    getProductsByCategory,
    getProductById,
    deleteProduct,
    getAllProducts,
    getProductsByPage,
    searchProducts,
    updateProduct,
    listProductsBySubCategory
} = require('../controllers/productController');


// Route to create a product
router.post('/', passportjwt.authenticate(), authorize('admin'), upload.single('image_url'), createProduct);
// router.post('/', upload.array('image_url', 10), createProduct);
// Route to get products by category
router.post('/category/:category_id', getProductsByCategory);
// get product by Id
router.post('/:product_id', getProductById);
// Delete product
router.delete('/:id', deleteProduct);
// retrive all products
router.get('/', getAllProducts);
// paginatation
router.get('/paginate', getProductsByPage);
// search products
router.get('/search', searchProducts);
// Update product
router.patch('/:id', updateProduct);
// list subSubProductsByCategory
router.get('/:id/products', listProductsBySubCategory);

module.exports = router;
