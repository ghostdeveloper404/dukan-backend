const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
  
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("🎯 Google profile:", profile); // <--- Add this
    console.log("🧪 Using client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("🧪 Using callback URL:", " process.env.GOOGLE_CALLBACK_URL");


    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: "google",
      });
    } else {
  // Ensure provider is set for existing users
    if (!user.provider) {
      user.provider = "google";
      await user.save();
    }
    user = await User.findById(user._id);
    }
    return done(null, user);
  } catch (err) {
    console.error("❌ Error in verify function:", err);
    return done(err, null);
  }
}));

