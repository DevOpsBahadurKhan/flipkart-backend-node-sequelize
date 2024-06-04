// cartItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
   
    // Quantity of the product in the cart
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1 // Default quantity to 1
    },
}, {
    modelName: 'CartItem',
    timestamps: true // Automatically manage createdAt and updatedAt fields
});


module.exports = CartItem;

