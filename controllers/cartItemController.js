const CartItem = require('../models/cart_items');
const Product = require('../models/products')
const Cart = require('../models/cart')


exports.createCartItem = async (req, res, next) => {
    try {
        const { productId, cartId, quantity } = req.body;

        // Assuming userId is available in req.user after authentication
        const userId = req.user.user_id;

        // Check if the product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 403;
            throw error;
        }

        // Check if the user has an existing cart with the provided cartId
        const cart = await Cart.findOne({ where: { userId, cartId } });
        if (!cart) {
            const error = new Error("Cart not found");
            error.statusCode = 403;
            throw error;
        }

        // Create a new cart item associated with the specified cart
        const cartItem = await CartItem.create({ userId, productId, quantity, cartId });

        res.send({ cartItem });
    } catch (error) {
        next(error);
    }
};


exports.updateCartItem = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        // Find the cart item by id
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) {
            res.send({ message: "Cart item not found" });
        }

        // Update the quantity of the cart item
        cartItem.quantity += quantity;
        await cartItem.save();

        res.send({ cartItem });

    } catch (error) {
        next(error);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;

        // Find the cart item by id
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Remove the cart item
        await cartItem.destroy();

        return res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
        next(error);
    }
};



