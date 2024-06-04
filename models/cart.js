// cart.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CartItem = require('./cart_items');
const Product = require('./products');

const Cart = sequelize.define('Cart', {
    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Foreign key to reference the User who owns the cart
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Total price of items in the cart
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0 // Default total price to 0
    }
}, {
    
    timestamps: false // Automatically manage createdAt and updatedAt fields
});


Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', onDelete: 'CASCADE' });

Cart.hasMany(Product, { foreignKey: 'product_id_2', onDelete: 'CASCADE' });
Product.belongsTo(Cart, { foreignKey: 'product_id_2', onDelete: 'CASCADE' });

module.exports = Cart;
