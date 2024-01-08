const AppError = require("../utils/appError");
const reviewModel = require("./../models/review_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");

exports.createReview = async (req) => {
  try {
    let reviewReq = buildReqBody(req.body);

    const user_id = reviewReq.user_id;
    const product_id = reviewReq.product_id;
    const user = await reviewModel.find({
      fields: ["user_id"],
      filter: { user_id, product_id },
    });

    if (user.length > 0) {
      throw new AppError(`You already created a review before`, 400);
    }

    const review = await reviewModel.create(reviewReq);
    return review;
  } catch (error) {
    throw error;
  }
};

exports.getReviewById = async (req) => {
  try {
    const review_id = req.params.id;
    let config = {
      filter: { review_id: review_id },
    };
    const review = await reviewModel.findById(config);
    return review;
  } catch (error) {
    throw error;
  }
};

exports.getAllReviews = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();

    const product_id = req.params.productId;
    if (product_id) {
      api.filter = { ...api.filter, product_id };
    }
    const review = await reviewModel.find(api);
    return review;
  } catch (error) {
    throw error;
  }
};

exports.updateReviewById = async (req) => {
  try {
    let review = buildReqBody(req.body);
    review["review_id"] = req.params.id;
    review["user_id"] = req.user.user_id;
    const newReview = await reviewModel.updateById(review);
    return newReview;
  } catch (error) {
    throw error;
  }
};

exports.deleteReviewById = async (req) => {
  try {
    const review_id = req.params.id;
    let user_id;
    if (req.user.role_name === "user") user_id = req.user.user_id;

    const review = await reviewModel.deleteById(review_id, user_id);
    return review;
  } catch (error) {
    throw error;
  }
};
