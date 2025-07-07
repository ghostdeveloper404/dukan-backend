const mongoose = require('../services/mongodb');

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    lastUpdatedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  }, { timestamps: true }
)

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports = ProductCategory;