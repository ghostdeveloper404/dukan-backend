const Joi = require('joi');

const productValidator = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().positive().required(),
  offPrice: Joi.number().positive().optional(),
  off: Joi.string().optional(),
  stars: Joi.number().integer().min(0).max(5).default(0),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).default(0),

  // Add more fields as needed
});

module.exports = { productValidator };