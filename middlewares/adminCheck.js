// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuthenticationCheck = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// middleware/adminCheck.js
const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access denied' });
};

module.exports = { userAuthenticationCheck, adminCheck };
