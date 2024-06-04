const Wishlist = require('../models/wishlists'); // Import the Wishlist model
const Product = require('../models/products'); // Product model to check if a product exists
const User = require('../models/users'); // User model for user references

// Add a product to a user's wishlist
exports.addToWishlist = async (req, res, next) => {
    try {
        const product_id = req.body.product_id; // Get productId from the request body
        const user_id = req.user.user_id; // Get user ID from the authenticated user

        if (!product_id) {
            res.send({ message: "Product ID is required" });
        }

        // Check if the product already exists in the wishlist
        const existingEntry = await Wishlist.findOne({
            where: { user_id: user_id, product_id: product_id },
        });

        if (existingEntry) {
            res.send({ message: "Product already in wishlist" });
        }

        // Add the product to the wishlist
        const newEntry = await Wishlist.create({ user_id: user_id, product_id: product_id });

        res.send({ message: "Product added to wishlist", wishlist: newEntry });
    } catch (error) {
        next(error);
    }
};


// Remove a product from a user's wishlist
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const product_id = req.body.product_id; // Product to remove from wishlist
        const user_id = req.user.user_id; // Authenticated user's ID

        if (!product_id) {
            // If product_id is missing, return an error message
            res.send({ message: "Product ID is required" });
        }

        // Find the product in the user's wishlist
        const wishlistEntry = await Wishlist.findOne({
            where: { user_id: user_id, product_id: product_id },
        });

        if (!wishlistEntry) {
            // If product not found, return an error message
            res.send({ message: "Product not found in wishlist" });
        }

        // Remove the product from the wishlist
        await wishlistEntry.destroy();

        // Respond with a success message
        res.send({ message: "Product removed from wishlist" });
    } catch (error) {
        next(error);
    }
};


// Get all products in a user's wishlist
exports.getUserWishlist = async (req, res, next) => {
    try {
        const user_id = req.user.user_id; // Authenticated user's ID

        // Fetch all products in the user's wishlist
        const wishlist = await Wishlist.findAll({
            where: { user_id: user_id },
            include: {
                model: Product,
                attributes: ['product_id', 'name', 'description', 'price'], // Include product details
            },
        });

        // Respond with the user's wishlist
        res.send({ wishlist });
    } catch (error) {
        next(error);
    }
};
