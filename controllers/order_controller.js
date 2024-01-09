const stripe = require("stripe")(process.env.STRIPE_SECRET);

const catchAsync = require("../utils/catchAsync");
const httpStatusText = require("../utils/httpStatusText");
const orderServices = require("./../services/order_services");
const factor = require("./handlersFactory");

exports.createOrder = catchAsync(async (req, res, next) => {
  const type = req.body.payment_method;
  let order;
  if (type === "cash") {
    order = await orderServices.createCashOrder(req);
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

const createCardOrder = catchAsync(async (session) => {
  const cart_id = session.client_reference_id;
  const shipping_address_id = session.metadata;
  const payment_method = "card";
  const req = {
    cart_id,
    shipping_address_id,
    payment_method,
    is_paid: true,
    paid_at: new Date(Date.now()).toISOString(),
  };
  const order = await orderServices.createCashOrder(req);
  return order;
});

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    console.log("Webhook event:", event);

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});
