const PaymentMethod = require('../models/payment_method');

// Controller to create a new payment method
exports.createPaymentMethod = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Create the payment method
        const paymentMethod = await PaymentMethod.create({ name, description });

        res.send({ message: 'Payment method created successfully', paymentMethod });
    } catch (error) {
        next(error);
    }
};

// Controller to get all payment methods
exports.getAllPaymentMethods = async (req, res, next) => {
    try {
        const paymentMethods = await PaymentMethod.findAll();
        res.send({ paymentMethods });
    } catch (error) {
        next(error);
    }
};

// Controller to get a single payment method by ID
exports.getPaymentMethodById = async (req, res, next) => {
    try {
        const paymentMethodId = req.params.id;
        const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        res.send({ paymentMethod });
    } catch (error) {
        next(error);
    }
};

// Controller to update a payment method
exports.updatePaymentMethod = async (req, res, next) => {
    try {
        const paymentMethodId = req.params.id;
        const { name, description } = req.body;

        // Find the payment method by ID
        let paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        // Update the payment method
        paymentMethod.name = name;
        paymentMethod.description = description;
        await paymentMethod.save();

        res.status(200).json({ message: 'Payment method updated successfully', paymentMethod });
    } catch (error) {
        next(error);
    }
};

// Controller to delete a payment method
exports.deletePaymentMethod = async (req, res, next) => {
    try {
        const paymentMethodId = req.params.id;

        // Find the payment method by ID
        const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        // Delete the payment method
        await paymentMethod.destroy();

        res.status(200).json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        next(error);
    }
};
