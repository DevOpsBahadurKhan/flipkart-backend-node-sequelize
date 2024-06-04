const PaymentMethod = require('../models/payment_method');
const Payment = require('../models/payments');

exports.getPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.findAll();
    res.send(paymentMethods);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

exports.getOrderPayments = async (req, res, next) => {
  try {
    const order_id = req.params.order_id; // Get order ID from route parameters

    const orderPayments = await Payment.findAll({
      where: { order_id },
      include: { model: PaymentMethod },
    });

    if (!orderPayments || orderPayments.length === 0) {
      res.send({ message: "No payments found for this order" });
    }

    res.status(200).json(orderPayments);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const { order_id, payment_method_id, amount } = req.body;

    if (!order_id || !payment_method_id || !amount) {
      return res.status(400).json({ message: "Order ID, payment method, and amount are required" });
    }

    const newPayment = await Payment.create({ order_id, payment_method_id, amount });
    res.status(201).json(newPayment);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};
