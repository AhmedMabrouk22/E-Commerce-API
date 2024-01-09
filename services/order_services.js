const stripe = require("stripe")(process.env.STRIPE_SECRET);

const orderModel = require("./../models/order_model");
const cartModel = require("./../models/shoppingCart_model");
const addressModel = require("./../models/address_model");
const AppError = require("./../utils/appError");
const buildReqBody = require("./../utils/buildReqBody");
const ApiFeatures = require("./../utils/apiFeatures");

exports.createCashOrder = async (req) => {
  try {
    // get user shopping cart
    const user_id = req.user.user_id;
    const cart = await cartModel.getCart(user_id);

    if (!cart) {
      throw new AppError(`shopping cart not contain any product`, 400);
    }

    const cart_id = cart.cart_id;

    // get user address
    const address = await addressModel.findById({
      filter: { address_id: req.body.shipping_address_id },
    });

    if (!address) {
      console.log("not found");
      throw new AppError(`this address not found`, 404);
    }

    let total_price;
    if (cart.total_price_after_discount === null) {
      total_price = cart.total_cart_price;
    } else {
      total_price = cart.total_price_after_discount;
    }

    //paid_at: new Date(Date.now()).toISOString(),

    const orderReq = {
      cart_id,
      user_id: req.user.user_id,
      shipping_address: req.body.shipping_address_id,
      total_price,
      is_paid: false,
    };

    // add order in db
    const order = await orderModel.createOrder(orderReq);

    // clear shopping cart
    await cartModel.clearCart(cart_id);

    return order;
  } catch (error) {
    throw error;
  }
};

exports.getAllOrders = async (req) => {
  try {
    const stringQuery = req.query;
    let api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();

    if (req.user.role_name === "user") api.filter.user_id = req.user.user_id;
    const orders = await orderModel.find(api);
    return orders;
  } catch (error) {
    throw error;
  }
};

exports.getOrder = async (req) => {
  try {
    const order_id = req.params.id;
    let filter = { order_id };
    if (req.user.role_name === "user") filter.user_id = req.user.user_id;
    const order = await orderModel.findById({
      filter,
    });
    return order;
  } catch (error) {
    throw error;
  }
};

exports.updateOrder = async (req) => {
  try {
    let orderReq = buildReqBody(req.body);
    orderReq.order_id = req.params.id;
    if (orderReq.status === "shipped") {
      orderReq.shipped_at = new Date(Date.now()).toISOString();
      const curOrder = await orderModel.findById({
        filter: { order_id: orderReq.order_id },
        felids: ["is_paid"],
      });

      if (!curOrder.is_paid) {
        orderReq.is_paid = true;
        orderReq.paid_at = new Date(Date.now()).toISOString();
      }
    }
    const order = await orderModel.updateOrder(orderReq);
    return order;
  } catch (error) {
    throw error;
  }
};

exports.checkoutSession = async (req) => {
  try {
    const cart = await cartModel.getCart(req.user.user_id);
    if (!cart) {
      throw new AppError(`This user not has shopping cart`, 404);
    }

    const cart_id = cart.cart_id;

    // get order price
    let total_price;
    if (cart.total_price_after_discount === null) {
      total_price = cart.total_cart_price;
    } else {
      total_price = cart.total_price_after_discount;
    }

    // Create stripe checkout session
    const user_name = req.user.first_name + " " + req.user.last_name;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: total_price * 100,
            product_data: {
              name: user_name,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/shoppingCart`,
      customer_email: req.user.email,
      client_reference_id: cart_id,
      metadata: {
        shipping_address_id: req.body.shipping_address_id,
      },
    });
    return session;
  } catch (error) {
    throw error;
  }
};
