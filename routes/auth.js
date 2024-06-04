const express = require('express');
const router = express.Router();

const passportjwt = require('../middleware/passportJWT')();
const authController = require('../controllers/authController');
const { userRegistrationValidations, userLoginValidations } = require('../validators/validators');

router.post("/login", userLoginValidations, authController.login);
router.post("/signup", userRegistrationValidations, authController.signup);
router.get("/me", passportjwt.authenticate(), authController.me);
// Update user profile route
router.patch('/profileUpdate', passportjwt.authenticate(), authController.updateProfile);
// Delete user account route
router.delete('/deleteAccount', passportjwt.authenticate(), authController.deleteAccount);

router.post("/forget-password", authController.forgetPassword);
router.get("/reset-password/:token", authController.resetPassword);

module.exports = router;