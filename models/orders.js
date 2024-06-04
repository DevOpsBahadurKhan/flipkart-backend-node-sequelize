const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const OrderItem = require('./order_items');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Foreign key to reference the User who owns the cart
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered'),
        defaultValue: 'pending'
    }
},
    {
        timestamps: true
    });


Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'CASCADE' });


module.exports = Order;