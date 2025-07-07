// controllers/order.controller.js
const Order = require("../models/order.model");
const Cart = require("../models/kart.model");

exports.placeOrder = async (req, res) => {
  try {
     
    const userId = req.user.id;
    const { shippingInfo, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    


    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((acc, item) => {
      const price = item.product.offPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    const newOrder = new Order({
      user: userId,
      items: cart.items,
      billingDetails: shippingInfo,
      paymentMethod,
      totalAmount,
    });
    
    await newOrder.save();

    // Clear the cart after placing order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed", error: err.message });
  }
};
