const Cart = require("../models/kart.model");
const Product = require("../models/product.model");

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedColor, selectedSize } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // create new cart if not exist
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // check if product already in cart with same size & color
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart", detail: err.message });
  }
};

// Get logged-in user's cart with full product info
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) return res.json({ items: [] }); // return empty cart if not created yet

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Update quantity of item in cart
exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, selectedColor, selectedSize, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart quantity updated", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity", detail: err.message });
  }
};


// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, selectedColor, selectedSize } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // filter out matching item
    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId ||
        item.selectedColor !== selectedColor ||
        item.selectedSize !== selectedSize
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item", detail: err.message });
  }
};
