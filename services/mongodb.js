const mongoose = require('mongoose');
require('dotenv').config();

const options = {
    autoIndex: true,
    maxPoolSize: 100,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4
};

const uri = `${process.env.MONGODB_URI || 'mongodb://localhost:27017'}`;

mongoose.connect(uri, options)

mongoose.connection.on('error', err => {
	console.error(err);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = mongoose;