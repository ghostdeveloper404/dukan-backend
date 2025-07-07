const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: { type: String, unique: true, lowercase: true },
  price: {
    type: Number,
    required: true
  },
  offPrice: { type: Number }, 
  off: { type: String },       
  stars: { type: Number, default: 0 },
  description: String,
  images: { type: [String], required: true },
  stock: { type: Number, required: true }, 
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
  }


}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);