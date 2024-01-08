const addressModel = require("./../models/address_model");
const ApiFeatures = require("./../utils/apiFeatures");
const buildReqBody = require("./../utils/buildReqBody");

exports.createAddress = async (req) => {
  try {
    let address = buildReqBody(req.body);
    address.user_id = req.user.user_id;
    const newAddress = await addressModel.create(address);
    return newAddress;
  } catch (error) {
    throw error;
  }
};

exports.updateAddress = async (req) => {
  try {
    let address = buildReqBody(req.body);
    address["address_id"] = req.params.id;
    address["user_id"] = req.user.user_id;
    const result = await addressModel.updateById(address);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getAllAddresses = async (req) => {
  try {
    const stringQuery = req.query;
    const api = new ApiFeatures(stringQuery, {})
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .getApiConfig();

    const user_id = req.user.user_id;
    if (user_id) {
      api.filter = { ...api.filter, user_id };
    }

    const addresses = await addressModel.find(api);
    return addresses;
  } catch (error) {
    throw error;
  }
};

exports.getAddressById = async (req) => {
  try {
    const address_id = req.params.id;
    let config = {
      filter: { address_id: address_id, user_id: req.user.user_id },
    };
    const address = await addressModel.findById(config);
    return address;
  } catch (error) {
    throw error;
  }
};

exports.deleteAddressById = async (req) => {
  try {
    const address_id = req.params.id;
    const user_id = req.user.user_id;
    return await addressModel.deleteById(address_id, user_id);
  } catch (error) {
    throw error;
  }
};
