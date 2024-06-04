const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
   
}, {
    timestamps: true
});



module.exports = OrderItem;
