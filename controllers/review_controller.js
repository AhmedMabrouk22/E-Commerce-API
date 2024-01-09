const reviewServices = require("./../services/review_services");
const factor = require("./handlersFactory");

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product_id) req.body.product_id = req.params.productId;
  if (!req.body.user_id) req.body.user_id = req.user.user_id;
  next();
};

// @desc    : Create new Review
// @route   : POST  api/v1/reviews
// @access  : Protected/Admin-manager
exports.createReview = factor.createOne(reviewServices.createReview);

// @desc    : Update Review
// @route   : PATCH api/v1/reviews/:id
// @access  : Protected/Admin-manager
exports.updateReview = factor.UpdateOne(reviewServices.updateReviewById);

// @desc    : Get all Reviews
// @route   : GET api/v1/reviews/
// @access  : Public
exports.getAllReviews = factor.get(reviewServices.getAllReviews);

// @desc    : Get Review
// @route   : GET api/v1/reviews/:id
// @access  : Public
exports.getReview = factor.getOne(reviewServices.getReviewById);

// @desc    : Delete Review
// @route   : DELETE api/v1/reviews/:id
// @access  : Protected/Admin-manager
exports.deleteReview = factor.deleteOne(reviewServices.deleteReviewById);
