const Joi = require('joi');

const addToCartValidator = Joi.object({
  productId: Joi.string().required(), // MongoDB ObjectId
  quantity: Joi.number().integer().min(1).required(),
  selectedColor: Joi.string().required(),
  selectedSize: Joi.string().required(),
});

const updateQuantityValidator = Joi.object({
  productId: Joi.string().required(),
  selectedColor: Joi.string().required(),
  selectedSize: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const removeFromCartValidator = Joi.object({
  productId: Joi.string().required(),
  selectedColor: Joi.string().required(),
  selectedSize: Joi.string().required(),
});

module.exports = {
  addToCartValidator,
  removeFromCartValidator,
  updateQuantityValidator
};
