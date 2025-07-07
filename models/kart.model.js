const mongoose = require('../services/mongodb');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  selectedColor: String,
  selectedSize: String,
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

// export mongoose.models.Cart || mongoose.model("Cart", cartSchema);
const kart = mongoose.model('kart', cartSchema);
module.exports = kart;