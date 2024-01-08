const express = require("express");

const addressController = require("./../controllers/address_controller");
const {
  addressIdValidator,
  createAddressValidator,
  updateAddressValidator,
} = require("./../validators/address_validators");
const { protect, restrictTo } = require("./../middlewares/auth_middleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    createAddressValidator,
    addressController.addAddress
  )
  .get(protect, restrictTo("user"), addressController.getAddresses);

router
  .route("/:id")
  .get(
    protect,
    restrictTo("user"),
    addressIdValidator,
    addressController.getAddress
  )
  .patch(
    protect,
    restrictTo("user"),
    updateAddressValidator,
    addressController.updateAddress
  )
  .delete(
    protect,
    restrictTo("user"),
    addressIdValidator,
    addressController.deleteAddress
  );

module.exports = router;
