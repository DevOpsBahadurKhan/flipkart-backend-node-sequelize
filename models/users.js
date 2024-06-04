const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const Address = require('./address');
const Cart = require('./cart');
const Order = require('./orders');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,

  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user' // Default role for new users
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  keepLoggedIn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Default value for keepLoggedIn
  }
}, { timestamps: false });

// Define associations for User and Order
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Define associations for User and Address
Address.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Address, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Define associations for User and Cart
User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Instance method to encrypt password
User.prototype.encryptPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Password encryption failed');
  }
};

// Instance method to validate password
User.prototype.validPassword = async function (candidatePassword) {
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    return result;
  } catch (error) {
    throw new Error('Password validation failed');
  }
};

module.exports = User;
