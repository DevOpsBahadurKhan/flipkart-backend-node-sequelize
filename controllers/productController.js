const Product = require('../models/products');
const Category = require('../models/categories');
const ProductCategory = require('../models/product_categories')
const { Op } = require('sequelize');

const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../s3Client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Controller to create a product
exports.createProduct = async (req, res, next) => {
  try {
    // Extract category ID from the request body
    const { category_id, ...productData } = req.body;

    // Check if the category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    // Handle product image upload
    if (req.file) {
      const uniqueName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: 'myhealet',
        Key: `images/${uniqueName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Set the product image URL
      productData.image_url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    }

    // Create the product with the associated category
    const product = await Product.create({ ...productData, category_id });
    await product.addCategory(category);
    res.send({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

// exports.createProduct = async (req, res, next) => {
//   try {
//       // Extract category ID from the request body
//       const { category_id, ...productData } = req.body;

//       // Check if the category exists
//       const category = await Category.findByPk(category_id);
//       if (!category) {
//           const error = new Error("Category not found");
//           error.statusCode = 404;
//           throw error;
//       }

//       // Array to store URLs of uploaded media files
//       const mediaUrls = [];

//       // Handle multiple file uploads (images and/or videos)
//       if (req.files && req.files.length > 0) {
//           for (const file of req.files) {
//               const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
//               const params = {
//                   Bucket: 'myhealet',
//                   Key: `media/${uniqueName}`, // 'media' directory for both images and videos
//                   Body: file.buffer,
//                   ContentType: file.mimetype,
//                   ACL: 'public-read'
//               };

//               const command = new PutObjectCommand(params);
//               await s3Client.send(command);

//               // Add the URL to the array
//               mediaUrls.push(`https://${params.Bucket}.s3.amazonaws.com/${params.Key}`);
//           }

//           // Add the media URLs to the product data
//           productData.image_url = JSON.stringify(mediaUrls)
//       }

//       // Create the product with the associated category
//       const product = await Product.create({ ...productData, category_id });
//       await product.addCategory(category);
//       res.send({ message: "Product created successfully", product });
//   } catch (error) {
//       next(error);
//   }
// };

// Controller to retrieve all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        through: {
          // Specify the join table model if needed
          model: ProductCategory,
        },
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// Function to fetch products in a sub-sub-category
exports.listProductsBySubCategory = async (req, res, next) => {
  try {
    const subSubCategoryId = req.params.id; // Get sub-sub-category ID from route parameter
    // Find the sub-sub-category
    const subSubCategory = await Category.findByPk(subSubCategoryId, {
      include: [{
        model: Product, // Fetch associated products
        through: { attributes: [] }, // Optionally, exclude join table attributes
      }],
    });

    if (!subSubCategory) {
      res.send({ message: 'Sub-sub-category not found' });
    }

    // Return the products in the sub-sub-category
    res.send({ listProductsBySubCategory: subSubCategory });

  } catch (error) {
    next(error)
  }
}

// pagination
exports.getProductsByPage = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize); // Convert strings to numbers
    const products = await Product.findAll({
      limit: parseInt(pageSize), // Convert pageSize to number
      offset: offset,
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// Retrieve Product By Id
exports.getProductById = async (req, res, next) => {
  try {
    const product_id = req.params.product_id;
    const product = await Product.findAll({
      where: { product_id }
    });
    if (!product) {
      const error = new Error("Product not found")
      error.statusCode = 404;
      throw error;
    }

    res.send(product);

  } catch (error) {
    next(error)
  }
}

// Retrieve Products By Category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category_id } = req.params;

    // Find products by category ID
    const products = await Product.findByPk(category_id, { include: Category });

    res.send(products);
  } catch (error) {
    next(error);
  }
};

// search product
exports.searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query; // Example: search?q=keyword

    // Perform search based on query parameter (e.g., name, category)
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { '$Category.name$': { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: Category }], // Include the Category table in the query
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, {
      where: { productId: id }
    });
    if (updated) {
      const updatedProduct = await Product.findOne({ where: { productId: id } });
      res.send(updatedProduct);
    } else {
      res.send({ message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};


//  delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({
      where: { productId: id }
    });

    if (deleted) {
      res.send({ message: "Product is Deleted" })
    }
    res.send({ message: "Product not found" });

  } catch (error) {
    next(error);
  }
};

// Get Featured Products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const featuredProducts = await Product.findAll({ where: { is_featured: true } });
    res.json(featuredProducts);
  } catch (error) {
    next(error);
  }
};

// Get Latest Products
exports.getLatestProducts = async (req, res, next) => {
  try {
    const latestProducts = await Product.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    res.json(latestProducts);
  } catch (error) {
    next(error);
  }
};

// getProductsByPriceRange
exports.getProductsByPriceRange = async (req, res, next) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const products = await Product.findAll({
      where: {
        price: {
          [Op.between]: [minPrice, maxPrice],
        },
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};
// getProductsByAvailability
exports.getProductsByAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.query;
    const products = await Product.findAll({
      where: {
        is_available: isAvailable,
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};
// getRelatedProducts
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.not]: productId }, // Exclude the current product
      },
      limit: 5, // Limit the number of related products
    });
    res.send(relatedProducts);
  } catch (error) {
    next(error);
  }
};
// getProductsByBrand
exports.getProductsByBrand = async (req, res, next) => {
  try {
    const { brand } = req.query;
    const products = await Product.findAll({
      where: {
        brand: {
          [Op.like]: `%${brand}%`,
        },
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};
// getProductsByTag
exports.getProductsByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;
    const products = await Product.findAll({
      where: {
        tags: {
          [Op.like]: `%${tag}%`,
        },
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// getProductsByRating
exports.getProductsByRating = async (req, res, next) => {
  try {
    const { minRating } = req.query;
    const products = await Product.findAll({
      where: {
        average_rating: {
          [Op.gte]: minRating,
        },
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// getDiscountedProducts
exports.getDiscountedProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        discount_price: {
          [Op.not]: null,
        },
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// Product recommendations
exports.getRecommendedProducts = async (req, res, next) => {
  try {
    // Logic to determine user preferences or history
    const userPreferences = req.user.preferences;
    const products = await Product.findAll({
      where: {
        category_id: userPreferences.category,
      },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// product review
exports.getProductsWithReviews = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Review,
        as: 'Reviews',
      }],
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
};
