'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const compression = require('compression');
const cors = require('cors');
const errorHandler = require('./middlewares/route-error-handler');
const { userAuthenticationCheck } = require('./middlewares/authentication');
const router = require('./routes/router');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
require('./google_auth/auth'); // <-- Import passport config

app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Add session and passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // better for auth
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
    collectionName: 'sessions',       // Optional: collection name
    ttl: 14 * 24 * 60 * 60            // Session lifetime in seconds (e.g., 14 days)
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie lifetime (14 days)
    secure: true,  // Set true if using HTTPS in production
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    sameSite: 'lax' // Good for OAuth redirects
  }
}));
// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true ,cookie: { secure: false } }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.status(200).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Server is working awesome</title><style>:root{--smaller:.75;}html,body{height:100%;margin:0;}body{align-items:center;background-color:#09ff00;display:flex;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;}.container{color:#fffdfd5c;text-align:center;position:center;}.circle{width:50vh;height:50vh;background-color:#ff0000;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}</style></head><body><div class="container"><div class="circle"></div></div></body></html>`)
})


// --- Google OAuth routes ---

// Step 1: Initiate Google login
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects here
app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: '/auth/failure',
    session: true // <--- Needed to persist login in session
  }),
  function(req, res) {
   
    res.redirect(process.env.FRONTEND_URL);
  }
);

app.get('/auth/failure', (req, res) => {
  res.status(401).json({ message: 'Google login failed!' });
});



// --- End Google OAuth routes ---


app.use('/api', router);

app.use(errorHandler.route);
app.use(errorHandler.next);

module.exports = app;