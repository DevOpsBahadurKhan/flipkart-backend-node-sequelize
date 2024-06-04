const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Your Sequelize configuration

const ShippingMethod = sequelize.define('ShippingMethod', {
  shipping_method_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false, // No createdAt and updatedAt
});

module.exports = ShippingMethod;
