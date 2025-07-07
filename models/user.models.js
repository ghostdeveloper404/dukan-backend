const mongoose = require('../services/mongodb');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: false, default: null, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: false, default: null, unique: true  },
    salt: { type: String, required: false, default: null },
    hash: { type: String, required: false, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    googleId: String, // if Google login
    provider:{ type: String, required: false, default: null }, // e.g., "google", "local"
    avatar: { type: String, default: "", },
    role: { type: String, enum: ['user', 'admin'],default: 'user'}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;