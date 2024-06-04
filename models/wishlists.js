const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./users'); // User model
const Product = require('./products'); // Product model

const Wishlist = sequelize.define('Wishlist', {
  wishlist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  product_id: {
    type: DataTypes.INTEGER
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations for Wishlist
Wishlist.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

User.hasMany(Wishlist, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', onDelete: 'CASCADE' });

module.exports = Wishlist;
