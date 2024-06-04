const Order = require('../models/orders');
const OrderItem = require('../models/order_items');
const Product = require('../models/products');
const Cart = require('../models/cart');
const CartItem = require('../models/cart_items');


exports.createOrderFromCart = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        // Retrieve user's cart with all cart items
        const cart = await Cart.findOne({
            where: { user_id },
            include: [{ model: CartItem, include: [Product] }],
        });

        if (!cart) {
            res.send({ message: "Cart not found" });
        }

        // Create a new order
        const order = await Order.create({ user_id, totalPrice: cart.totalPrice });

        // // Transfer cart items to order items
        for (const cartItem of cart.CartItems) {
            await OrderItem.create({
                order_id: order.order_id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                price: cartItem.Product.price // Assuming price is stored in the Product model
            });
        }

        // Clear the user's cart
        await CartItem.destroy({ where: { cart_id: cart.cart_id } });
        // res.send({ cart });

        res.send({ order });
    } catch (error) {
        next(error);
    }
};


exports.getOrder = async (req, res, next) => {
    try {
        const { order_id } = req.params;
        const user_id = req.user.user_id;

        // Retrieve the order by id
        const order = await Order.findOne({
            where: { order_id, user_id },
            include: [{ model: OrderItem, include: [Product] }]
        });

        if (!order) {
            const err = new Error("Order not found")
            err.statusCode = 203
            throw err;
        }
        res.send({ order });
    } catch (error) {
        next(error);
    }
};


exports.getAllOrders = async (req, res, next) => {
    try {
        const user_id = req.user.user_id; // Assuming user ID is available in req.user after authentication

        // Retrieve all orders for the authenticated user
        const orders = await Order.findAll({
            where: { user_id },
            include: [{ model: OrderItem, include: [Product] }]
        });

        res.send({ orders });
    } catch (error) {
        next(error);
    }
};
// Add other controller functions as needed
