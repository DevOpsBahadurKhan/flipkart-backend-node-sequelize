const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./categories')
const ProductCategory = require('./product_categories')
const CartItem = require('./cart_items')
const OrderItem = require('./order_items')


const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255],
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true, // Price must be a decimal number
      min: 0, // Price must be positive
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, // Quantity must be an integer
      min: 0, // Quantity must be non-negative
    }
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: false
});

// Define associations for Product and OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// Define associations for Product and CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });


// Define associations for Product
Product.belongsToMany(Category, {
  through: ProductCategory, // Using a join table for many-to-many
  foreignKey: 'product_id',
});

// Define associations for Category
Category.belongsToMany(Product, {
  through: ProductCategory,  // Reciprocal association
  foreignKey: 'category_id',
});



module.exports = Product;