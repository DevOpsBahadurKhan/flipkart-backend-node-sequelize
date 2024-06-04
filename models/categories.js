const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parent_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },

}, { timestamps: false });


// Self-referential association for sub-categories
Category.belongsTo(Category, { as: 'ParentCategory', foreignKey: 'parent_category_id' }); // To fetch parent category
Category.hasMany(Category, { as: 'Subcategories', foreignKey: 'parent_category_id' });

module.exports = Category;