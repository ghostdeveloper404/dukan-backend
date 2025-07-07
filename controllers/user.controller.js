const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.models')
const crypto = require('crypto');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email })
    console.log({ userExists })
    if (userExists) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, hash, salt });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(201).json({ success: true, token, expiresIn: '1d' });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    let isPasswordValid = false;

    const isBcryptUser = user.hash && user.salt && user.salt.startsWith('$2a$');

    if (isBcryptUser) {
      // ✅ Bcrypt-based user (registered via signup)
      isPasswordValid = await bcrypt.compare(password, user.hash);
    } else if (user.salt && user.hash) {
      // ✅ Crypto-based user (admin seeded)
      const inputHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`);
      isPasswordValid = inputHash === user.hash;
    }

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
  // try {
  //     const { email, password } = req.body;
  //     const existingUser = await User.findOne({ email });

  //     if (!existingUser) {
  //         return res.status(400).json({ success: false, error:"Invalid credentials"});
  //     }
  //     const isPasswordCorrect = await bcrypt.compare(password, existingUser.hash);
  //     if (!isPasswordCorrect) {
  //         return res.status(400).json({ success: false, error:"Invalid credentials"});
  //     }
  //     const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  //     return res.status(200).json({ token });

  // } catch (error) {
  //     return res.status(400).json({ success: false, error:"Invalid credentials"});
  // }
};

// Example: user.controller.js


module.exports = {
  register,
  login
};