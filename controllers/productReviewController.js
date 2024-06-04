const ProductReview = require('../models/product_review');
const Rating = require('../models/rating');
const Comment = require('../models/comment');

// Create a new product review
exports.createProductReview = async (req, res, next) => {
  try {
    const { product_id, rating_id, comment_id } = req.body;

    const user_id = req.user.user_id; // authenticated user

    const newReview = await ProductReview.create({
      product_id,
      user_id,
      rating_id,
      comment_id,
    });

    res.send({ message: 'Review created', review: newReview });
  } catch (error) {
    next(error);
  }
};

// Get all reviews for a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    const reviews = await ProductReview.findAll({
      where: { product_id: product_id },
      include: [
        { model: Rating, attributes: ['rating'] }, // Include related rating
        { model: Comment, attributes: ['comment'] }, // Include related comment
      ],
    });

    res.send({ reviews });
  } catch (error) {
    next(error);
  }
};

// Update a product review
exports.updateProductReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { rating_id, comment_id } = req.body;

    const [updatedCount, [updatedReview]] = await ProductReview.update(
      { rating_id, comment_id },
      { where: { review_id }, returning: true, plain: true }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated', review: updatedReview });
  } catch (error) {
    next(error);
  }
};

// Delete a product review
exports.deleteProductReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;

    const deletedCount = await ProductReview.destroy({ where: { review_id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
