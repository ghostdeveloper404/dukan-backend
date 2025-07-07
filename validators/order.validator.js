// validators/orderValidator.js
const Joi = require("joi");

const shippingInfoSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
});

const placeOrderValidator = Joi.object({
  shippingInfo: shippingInfoSchema.required(),
  paymentMethod: Joi.string().valid('Online', 'Cash on Delivery').required(), 
});

module.exports = { placeOrderValidator };
