const Cart = require('../models/cart');
const CartItem = require('../models/cart_items');
const Product = require('../models/products');
const validationHandler = require('../validators/validationHnadler');

exports.addToCart = async (req, res, next) => {
    validationHandler(req);
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.user_id; // Assuming userId is available in req.user after authentication


        // Check if the product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 403;
            throw error;
        }


        // Check if the user already has a cart
        let cart = await Cart.findOne({ where: { user_id } });
        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = await Cart.create({ user_id });
        }

        // Check if the product is already in the cart
        let cartItem = await CartItem.findOne({
            where: { product_id, cart_id: cart.cart_id }
        });

        if (cartItem) {
            // If the product is already in the cart, update the quantity
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // If the product is not in the cart, create a new cart item
            cartItem = await CartItem.create({
                user_id,
                cart_id: cart.cart_id,
                product_id,
                quantity,
            });
        }
        res.send({ message: "Product added to cart successfully" });
    } catch (error) {
        next(error);
    }
};


exports.removeFromCart = async (req, res, next) => {
    validationHandler(req);
    try {
        const { cartItemId } = req.params;

        // Find the cart item by id
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) {
            res.status(204).send({ message: "Cart item not found" });
        }

        // Remove the cart item
        await cartItem.destroy();

        res.send({ message: "Cart item removed successfully" });
    } catch (error) {
        next(error);
    }
};


exports.getCart = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        // Find the user's cart with all cart items and their associated products
        const cart = await Cart.findOne({
            where: { user_id }, // Find the cart for the authenticated user
            include: {
                model: CartItem,
                attributes: ['id', 'quantity'],
                include: {
                    model: Product,
                    attributes: ['product_id', 'name', 'description', 'price'], // Include desired product attributes
                },
            },
        });

        if (!cart) {
            const err = new Error("cart not found");
            err.statusCode = 404;  // Return a 404 if no cart found
            throw err;
        }

        res.send({
            statusCode: 200,
            message: "cart with all cart items and their associated products",
            cart
        });

    } catch (error) {
        next(error);
    }
};

