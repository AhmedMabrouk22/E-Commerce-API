const slug = require("slugify");

const couponModel = require("./../models/coupon_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");

exports.createCoupon = async (req) => {
  try {
    let coupon = buildReqBody(req.body);
    coupon.coupon_code = slug(coupon.coupon_code.trim());
    const newCoupon = await couponModel.create(coupon);
    return newCoupon;
  } catch (error) {
    throw error;
  }
};

exports.updateCoupon = async (req) => {
  try {
    let coupon = buildReqBody(req.body);
    coupon["coupon_code"] = req.params.code;
    const result = await couponModel.updateById(coupon);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getAllCoupons = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();

    const coupons = await couponModel.find(api);
    return coupons;
  } catch (error) {
    throw error;
  }
};

exports.getCouponById = async (req) => {
  try {
    const coupon_code = req.params.code;
    let config = {
      filter: { coupon_code: coupon_code },
    };
    const coupon = await couponModel.findById(config);
    return coupon;
  } catch (error) {
    throw error;
  }
};

exports.deleteCouponById = async (req) => {
  try {
    const coupon_code = req.params.code;
    return await couponModel.deleteById(coupon_code);
  } catch (error) {
    throw error;
  }
};
