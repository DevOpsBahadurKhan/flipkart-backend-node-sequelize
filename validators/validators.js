const { body, validationResult } = require('express-validator');
const Address = require('../models/address');
const Category = require('../models/categories');


// User registration validations
exports.userRegistrationValidations = [
    // Username should be at least 3 characters, only alphanumeric, and cannot start or end with whitespace
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .isAlphanumeric()
        .withMessage('Username must contain only letters and numbers')
        .trim()
        .withMessage('Username cannot start or end with whitespace'),

    body('email')
        .isEmail().withMessage("Email field must contain correct email"),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
];

// User login validations
exports.userLoginValidations = [
    // Email should be a valid email, trimmed, and not empty
    body('email')
        .trim() // Remove leading/trailing whitespace
        .notEmpty() // Ensure email is not empty
        .withMessage('Email is required')
        .isEmail() // Validate that it's a valid email format
        .withMessage('Please provide a valid email address'),

    // Password should not be empty and at least 6 characters long
    body('password')
        .trim() // Remove leading/trailing whitespace
        .notEmpty() // Ensure password is not empty
        .withMessage('Password is required for login')
        .isLength({ min: 6 }) // Ensure a minimum length for passwords
        .withMessage('Password must be at least 6 characters long'),
];

// Category validation
exports.hasCategoryName = body('name')
    .notEmpty().withMessage('Category name is required')
    .isString().withMessage('Category name must be a string')
    .trim()
    .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters long')
    .custom(async (value) => {
        const existingCategory = await Category.findOne({ where: { name: value } });
        if (existingCategory) {
            throw new Error("Category already exists");
        }
        return true;
    });


exports.addressValidations = [
    // Validate street
    body('street')
        .notEmpty().withMessage('Street is required')
        .isString().withMessage('Street must be a string')
        .trim(),
    // Validate city
    body('city')
        .notEmpty().withMessage('City is required')
        .isString().withMessage('City must be a string')
        .trim(),
    // Validate state
    body('state')
        .notEmpty().withMessage('State is required')
        .isString().withMessage('State must be a string')
        .trim(),
    // Validate zip
    body('zip')
        .notEmpty().withMessage('ZIP code is required')
        .isString().withMessage('ZIP code must be a string')
        .trim(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { street, city, state, zip } = req.body;
        const existingAddress = await Address.findOne({ where: { street, city, state, zip } });
        if (existingAddress) {
            return res.status(400).json({ message: 'Address already exists' });
        }

        next();
    }
];