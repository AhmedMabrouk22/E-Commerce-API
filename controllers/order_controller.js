const stripe = require("stripe")(process.env.STRIPE_SECRET);

const catchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");
const orderServices = require("./../services/order_services");
const factor = require("./handlersFactory");

exports.createOrder = catchAsync(async (req, res, next) => {
  const type = req.body.payment_method;
  let order;
  if (type === "cash") {
    order = await orderServices.createOrder(req);
    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "order added successfully",
      order,
    });
  } else {
    const session = await orderServices.checkoutSession(req);
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      url: session.url,
    });
  }
});
exports.getOrders = factor.get(orderServices.getAllOrders);

exports.getOrder = factor.getOne(orderServices.getOrder);

exports.changeOrderStatus = factor.UpdateOne(orderServices.updateOrder);

const createCardOrder = async (session) => {
  try {
    const user_id = session.client_reference_id;
    const shipping_address_id = session.metadata.shipping_address_id;
    const body = {
      shipping_address_id,
      payment_method: "card",
      is_paid: true,
      paid_at: new Date(Date.now()).toISOString(),
    };

    const reqOrder = {
      user: {
        user_id,
      },
      body,
    };

    const order = await orderServices.createOrder(reqOrder);
    return order;
  } catch (error) {
    throw error;
  }
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // add order
    if (event.type === "checkout.session.completed") {
      await createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

exports.orderSuccess = (req, res, next) => {
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: `Order added successfully`,
  });
};

exports.orderCancel = (req, res, next) => {
  res.status(200).json({
    status: httpStatusText.FAIL,
    message: `Something wrong, order canceled`,
  });
};
