const express = require("express");

const reviewController = require("./../controllers/review_controller");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} = require("./../validators/review_validator");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    reviewController.setProductIdAndUserIdToBody,
    createReviewValidator,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(getReviewValidator, reviewController.getReview)
  .patch(
    protect,
    restrictTo("user"),
    updateReviewValidator,
    reviewController.updateReview
  )
  .delete(
    getReviewValidator,
    protect,
    restrictTo("user", "admin", "manager"),
    reviewController.deleteReview
  );

module.exports = router;
