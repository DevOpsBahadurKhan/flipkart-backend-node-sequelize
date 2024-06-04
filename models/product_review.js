const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./products'); 
const User = require('./users'); 
const Rating = require('./rating'); // Assuming you have a Rating model
const Comment = require('./comment'); // Assuming you have a Comment model

const ProductReview = sequelize.define('ProductReview', {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  rating_id: {
    type: DataTypes.INTEGER
  },
  comment_id: {
    type: DataTypes.INTEGER
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // Since created_at is explicitly defined
});

ProductReview.belongsTo(Product, { foreignKey: 'product_id' });
ProductReview.belongsTo(User, { foreignKey: 'user_id' });
ProductReview.belongsTo(Rating, { foreignKey: 'rating_id' });
ProductReview.belongsTo(Comment, { foreignKey: 'comment_id' });

module.exports = ProductReview;
