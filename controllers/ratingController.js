const Rating = require('../models/rating');

// Create a new rating
exports.createRating = async (req, res, next) => {
    try {
      const { rating } = req.body;
  
      const newRating = await Rating.create({ rating });
  
      res.send({ message: 'Rating created', rating: newRating });
    } catch (error) {
      next(error);
    }
  };

  

  // Get all ratings
exports.getRatings = async (req, res, next) => {
    try {
      const ratings = await Rating.findAll();
  
      res.send({ ratings });
    } catch (error) {
      next(error);
    }
  };