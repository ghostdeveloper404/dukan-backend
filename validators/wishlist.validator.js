// validators/wishlist.validator.js
const Joi = require("joi");

exports.addToWishlistValidator = Joi.object({
  productId: Joi.string().length(24).required(), // MongoDB ObjectId
});

exports.removeFromWishlistValidator = Joi.object({
  productId: Joi.string().length(24).required(),
});
