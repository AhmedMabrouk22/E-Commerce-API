const addressServices = require("./../services/address_services");
const factor = require("./handlersFactory");

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = factor.createOne(addressServices.createAddress);

// @desc    Get user addresses list
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getAddresses = factor.get(addressServices.getAllAddresses);

// @desc    Get user address list
// @route   GET /api/v1/addresses/:id
// @access  Protected/User
exports.getAddress = factor.getOne(addressServices.getAddressById);

// @desc    Update user address list
// @route   PATCH /api/v1/addresses/:id
// @access  Protected/User
exports.updateAddress = factor.UpdateOne(addressServices.updateAddress);

// @desc    Delete user address list
// @route   DELETE /api/v1/addresses/:id
// @access  Protected/User
exports.deleteAddress = factor.deleteOne(addressServices.deleteAddressById);
