// Create an address for the currently logged-in user
const Address = require('../models/address');
const User = require('../models/users');
const validationHandler = require('../validators/validationHnadler');

exports.createAddress = async (req, res, next) => {

  try {
    validationHandler(req)
    const { street, city, state, zip } = req.body;
    const address = await Address.create({
      street, city, state, zip,
      user_id: req.user.user_id, // Associate the address with the logged-in user
    });
    res.send(address);
  } catch (error) {
    next(error)
  }
};


exports.listAddress = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const addresses = await Address.findOne(
      {
        where: { user_id },
        include: {
          model: User,
          attributes: ['username', 'email', 'password'], // Only include these fields from User
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] }, // Exclude unwanted fields from Address
      }
    );
    res.send(addresses);

  } catch (error) {
    next(error)
  }
}