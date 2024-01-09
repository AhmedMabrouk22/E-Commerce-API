const cartModel = require("./../models/shoppingCart_model");
const couponModel = require("./../models/coupon_model");
const buildQueryBody = require("./../utils/buildReqBody");
const AppError = require("../utils/appError");

const calcTotalCartPrice = async (cart_id) => {
  try {
    const products = await cartModel.getCartItemsInDetails({
      fields: ["products"],
      filter: { cart_id },
    });

    let totalPrice = 0;
    products.products.forEach((item) => {
      totalPrice += item.quantity * item.product_price;
    });

    return totalPrice;
  } catch (error) {
    throw error;
  }
};

exports.add = async (req) => {
  try {
    // 1) get products in cart
    let request = buildQueryBody(req.body);
    const user_id = req.user.user_id;
    const product_id = req.body.product_id;
    let cart = await cartModel.getCart(user_id);

    if (!cart) {
      cart = await cartModel.createShoppingCart(user_id);
    }

    // 2) check if this product is exist in cart
    const cart_id = cart.cart_id;
    const products = await cartModel.getCartItems(cart_id);
    let productIndex = -1;

    if (products) {
      productIndex = products.findIndex(
        (item) => item.product_id == product_id
      );
    }
    // 3) if exist increase quantity
    let newItem;
    request.cart_id = cart_id;
    if (productIndex > -1) {
      if (!request.quantity) {
        let quantity = products[productIndex].quantity;
        quantity += 1;
        request.quantity = quantity;
      }
      newItem = await cartModel.updateProduct(request);
    } else {
      newItem = await cartModel.addProduct(request);
    }

    const totalPrice = await calcTotalCartPrice(cart_id);
    await cartModel.updateShoppingCart({
      cart_id,
      total_cart_price: totalPrice,
    });
    return newItem;
  } catch (error) {
    throw error;
  }
};

exports.getShoppingCart = async (req) => {
  try {
    const user_id = req.user.user_id;
    const cart = await cartModel.getCartItemsInDetails({
      filter: { user_id },
    });
    return cart;
  } catch (error) {
    throw error;
  }
};

exports.deleteProduct = async (req) => {
  try {
    const user_id = req.user.user_id;
    const cart = await cartModel.getCart(user_id);
    const cart_id = cart.cart_id;
    const product_id = req.params.productId;
    const result = await cartModel.deleteProduct(cart_id, product_id);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.clearCart = async (req) => {
  try {
    const user_id = req.user.user_id;
    const cart = await cartModel.getCart(user_id);
    const cart_id = cart.cart_id;
    const result = await cartModel.clearCart(cart_id);
    await cartModel.updateShoppingCart({
      cart_id,
      total_cart_price: null,
      total_Price_after_discount: null,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

exports.applyCoupon = async (req) => {
  try {
    const coupon_code = req.body.coupon_code;
    const data = new Date(Date.now()).toISOString();
    const coupon = await couponModel.findById({
      filter: { coupon_code, expire: { ">": data } },
    });

    if (!coupon) {
      throw new AppError(`Coupon is invalid or expired`, 400);
    }

    const cart = await cartModel.getCart(req.user.user_id);
    const totalPrice = cart.total_cart_price;
    const total_price_after_discount = (
      totalPrice -
      (totalPrice * coupon.discount) / 100
    ).toFixed(2);

    const newCart = await cartModel.updateShoppingCart({
      total_price_after_discount,
      cart_id: cart.cart_id,
    });

    return newCart;
  } catch (error) {
    throw error;
  }
};

exports.getCart = async (req) => {
  try {
    const user_id = req.user.user_id;
    const cart = await cartModel.getCart(user_id);
    return cart;
  } catch (error) {
    throw error;
  }
};
