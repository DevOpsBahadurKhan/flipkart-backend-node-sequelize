const ShippingMethod = require('../models/ShippingMethod');
const OrderShipping = require('../models/OrderShipping');

exports.getShippingMethods = async (req, res, next) => {
  try {
    const shippingMethods = await ShippingMethod.findAll();
    res.status(200).json(shippingMethods);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

exports.getOrderShipping = async (req, res, next) => {
  try {
    const order_id = req.params.order_id; // Get order ID from route parameters

    const orderShipping = await OrderShipping.findOne({
      where: { order_id },
      include: { model: ShippingMethod },
    });

    if (!orderShipping) {
      return res.status(404).json({ message: "Shipping details not found for this order" });
    }

    res.status(200).json(orderShipping);
  } catch (error) {
    next(error);
  }
};

exports.createShippingMethod = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newShippingMethod = await ShippingMethod.create({ name, description, price });
    res.status(201).json(newShippingMethod);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};
