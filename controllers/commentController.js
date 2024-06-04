const Comment = require('../models/comment');


// Create a new comment
exports.createComment = async (req, res, next) => {
    try {
        const { comment } = req.body;

        const newComment = await Comment.create({ comment });

        res.send({ message: 'Comment created', comment: newComment });
    } catch (error) {
        next(error);
    }
};


// Get all comments
exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll();

        res.send({ comments });
    } catch (error) {
        next(error);
    }
};
