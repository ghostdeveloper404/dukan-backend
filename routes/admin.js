// routes/admin.js
const express = require('express');
const router = express.Router();
const { userAuthenticationCheck } = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

// Sample admin route
router.get('/dashboard', userAuthenticationCheck, adminCheck, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

module.exports = router;
