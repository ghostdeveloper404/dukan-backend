const express = require('express');
const router = express.Router();
const userValidator = require('../validators/user.model.validation');
const productCategoryValidator = require('../validators/product-category.model.validation');
const productCategory  = require('../controllers/product-category.controller');
const { userAuthenticationCheck } = require('../middlewares/authentication');
const productController = require('../controllers/product.controller');
const User = require('../models/user.models');
const { register, login } = require('../controllers/user.controller');
const validation = require('../middlewares/model-validation');

const cartController = require('../controllers/kart.controller');
const { updateQuantityValidator } = require('../validators/kart.validator');
const { removeFromCartValidator } = require('../validators/kart.validator');
const { addToCartValidator } = require('../validators/kart.validator');
const orderController = require('../controllers/order.contorller');
const { placeOrderValidator } = require("../validators/order.validator");
const wishlistController = require("../controllers/wishlist.controller");
const { addToWishlistValidator, removeFromWishlistValidator } = require("../validators/wishlist.validator");



//User Routes
router.post('/user/register', validation.bodyValidator(userValidator.userRegistration), register);
router.post('/user/login', validation.bodyValidator(userValidator.userLogin), login);
// Add this somewhere below your imports and before `module.exports = router;`

// ✅ Get currently logged-in user
router.get('/user/me', userAuthenticationCheck, (req, res) => {
  const user = req.user;

  res.status(200).json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    _id: user._id,
    googleId: user.googleId || null,
    provider: user.provider || null,
  }); 
});



// logout route
router.get('/user/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid"); // or the session cookie name
   
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

router.put("/user/update", userAuthenticationCheck, async (req, res) => {
  const { name, email, avatar = "" } = req.body;

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized - no user in request" });
  }

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, avatar },
    { new: true }
  );

  if (!updatedUser) {
    if (err.code === 11000) {
    return res.status(400).json({ error: "That email is already in use." });
  }
 
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user: updatedUser });
});




// Add product to cart
router.post(
  "/add",
  userAuthenticationCheck,
  validation.bodyValidator(addToCartValidator),
  cartController.addToCart
);

// Get user's cart
router.get("/cart", userAuthenticationCheck, cartController.getCart);

// Remove item from cart
router.delete(
  "/remove",
  userAuthenticationCheck,
  validation.bodyValidator(removeFromCartValidator),
  cartController.removeFromCart
);


router.put(
  "/update-quantity",
  userAuthenticationCheck,
  validation.bodyValidator(updateQuantityValidator),
  cartController.updateCartQuantity
);



router.post(
  "/checkout",
  userAuthenticationCheck,
  validation.bodyValidator(placeOrderValidator),
  orderController.placeOrder
);

router.get(
  "/wishlist",
  userAuthenticationCheck,
  wishlistController.getWishlist
);




router.post(
  "/wishlist/add",
  userAuthenticationCheck,
  validation.bodyValidator(addToWishlistValidator),
  wishlistController.addToWishlist
);

router.put(
  "/wishlist/remove",
  userAuthenticationCheck,
  validation.bodyValidator(removeFromWishlistValidator),
  wishlistController.removeFromWishlist
);


//Product Routescd dukan-backend
router.post('/newproducts', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/slug/:slug', productController.getProductBySlug);
router.post('/products/search', validation.bodyValidator(productCategoryValidator.filterProduct), productController.searchProducts);
router.post('/products/filter', productController.filterProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);



//Product Category Routes
router.post('/product-category/create', userAuthenticationCheck, validation.bodyValidator(productCategoryValidator.createCategory), productCategory.createProductCategory);
router.get('/product-category/all', productCategory.getAllProductCategories);
router.get('/product-category', validation.queryValidator(productCategoryValidator.getSingleProductCategory), productCategory.getSingleProductCategory);
router.post('/product-category/update',userAuthenticationCheck, validation.bodyValidator(productCategoryValidator.updateProductCategory), productCategory.updateProductCategory);
router.post('/product-category/delete', validation.bodyValidator(productCategoryValidator.deleteProductCategory),  productCategory.deleteProductCategory);
router.post('/product-category/search', validation.bodyValidator(productCategoryValidator.filterPorudctCategory), productCategory.searchProudctCategory);
router.post('/product-category/filter', productCategory.filterPorudctCategory);




module.exports = router; 