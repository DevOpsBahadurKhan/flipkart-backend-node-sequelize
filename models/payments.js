const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./orders'); // Order model
const PaymentMethod = require('./payment_method'); // PaymentMethod model

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Set up associations
Order.hasMany(Payment, { foreignKey: 'order_id' });
PaymentMethod.hasMany(Payment, { foreignKey: 'payment_method_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });
Payment.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id' });

module.exports = Payment;
