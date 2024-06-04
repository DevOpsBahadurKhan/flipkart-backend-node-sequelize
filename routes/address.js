const express = require('express');
const passportjwt = require('../middleware/passportJWT')();
const router = express.Router();
const { addressValidations } = require('../validators/validators');

const { 
    createAddress,
    listAddress 
} = require('../controllers/addressController');

// POST /address - Create an address for the currently logged-in user
router.post('/', addressValidations, passportjwt.authenticate(), createAddress);
router.get('/', passportjwt.authenticate(), listAddress);
module.exports = router;