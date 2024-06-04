const OrderItems = require('../models/order_items');

exports.createOrderItems = async (req, res, next) => {
    try {
        const { orderId, productId, quantity, price } = req.body;

        // Create a new order item
        const OrderItems = await OrderItems.create({ orderId, productId, quantity, price });

        res.send({ OrderItems });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderItems = async (req, res, next) => {
    try {
        const { OrderItemsId } = req.params;
        const { quantity } = req.body;

        // Find the order item by id
        const OrderItems = await OrderItems.findByPk(OrderItemsId);
        if (!OrderItems) {
            return res.status(404).json({ message: "Order item not found" });
        }

        // Update the quantity of the order item
        OrderItems.quantity = quantity;
        await OrderItems.save();

        return res.status(200).json({ OrderItems });
    } catch (error) {
        next(error);
    }
};

exports.deleteOrderItems = async (req, res, next) => {
    try {
        const { OrderItemsId } = req.params;

        // Find the order item by id
        const OrderItems = await OrderItems.findByPk(OrderItemsId);
        if (!OrderItems) {
            return res.status(404).json({ message: "Order item not found" });
        }

        // Remove the order item
        await OrderItems.destroy();

        return res.status(200).json({ message: "Order item deleted successfully" });
    } catch (error) {
        next(error);
    }
};
