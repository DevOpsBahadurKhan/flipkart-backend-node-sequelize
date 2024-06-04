const Category = require('../models/categories');
const { Op } = require('sequelize')
const validationHandler = require('../validators/validationHnadler');


// Controller to create a category
exports.createCategory = async (req, res, next) => {
  try {
    validationHandler(req);
    // Create the category if it doesn't exist
    const category = await Category.create(req.body);
    res.send(category);

  } catch (error) {
    next(error);
  }
};


exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.send({ categories });

  } catch (error) {
    next(error)
  }
}

// // list Related Sub Categories
exports.getSubSubCategories = async (req, res, next) => {
  try {
    const { parentCategoryId } = req.params;

    // Fetch all categories where the parent_category_id matches the given ID
    const subcategories = await Category.findAll({
      where: { parent_category_id: parentCategoryId },
    });

    if (subcategories.length === 0) {
      res.send({ message: 'No sub-sub-categories found for this parent category' });
    }


    res.send({ subcategories });
  } catch (error) {
    next(error);
  }
};

// filter Categories
exports.filterCategories = async (req, res, next) => {
  try {
    const { name, parent_category_id } = req.query;

    const whereConditions = {}; // Create an object to store filter conditions

    // Add condition to filter by category name (partial match)
    if (name) {
      whereConditions.name = {
        [Op.like]: `%${name}%`, // Partial match using LIKE
      };
    }

    // Add condition to filter by parent category
    if (parent_category_id) {
      whereConditions.parent_category_id = parent_category_id;
    }

    const categories = await Category.findAll({
      where: whereConditions, // Apply filter conditions
    });

    if (categories.length === 0) {
      res.send({ message: 'No categories found matching the criteria' });
    }

    res.send({ categories }); // Return filtered categories

  } catch (error) {
    next(error); // Forward unexpected errors to error-handling middleware
  }
};
