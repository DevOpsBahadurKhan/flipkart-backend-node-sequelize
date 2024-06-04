const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductCategory = sequelize.define('ProductCategory', {
  
}, 
{
    timestamps: false
});

module.exports = ProductCategory;
