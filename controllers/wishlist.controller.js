// controllers/wishlist.controller.js
const Wishlist = require("../models/wishlist.model");

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const exists = wishlist.items.some((item) => item.product.toString() === productId);
    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.status(201).json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");
  res.json(wishlist);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

  wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId);
  await wishlist.save();

  res.json({ message: "Removed from wishlist" });
};
