const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./orders');
const ShippingMethod = require('./shipping_method');

const OrderShipping = sequelize.define('OrderShipping', {
  order_shipping_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shipping_method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tracking_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false, // No createdAt and updatedAt
});

// Set up associations
Order.hasOne(OrderShipping, { foreignKey: 'order_id', onDelete: 'CASCADE' });
ShippingMethod.hasMany(OrderShipping, { foreignKey: 'shipping_method_id' });
OrderShipping.belongsTo(Order, { foreignKey: 'order_id' });
OrderShipping.belongsTo(ShippingMethod, { foreignKey: 'shipping_method_id' });

module.exports = OrderShipping;
