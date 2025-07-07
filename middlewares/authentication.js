const jwt = require('jsonwebtoken');
const User = require('../models/user.models');

const userAuthenticationCheck = async (req, res, next) => {
  console.log("AUTH CHECK:", req.isAuthenticated && req.isAuthenticated());
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);


  // 1. Allow if authenticated via Passport (session)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // 2. Check for JWT in Authorization header
  const authHeader = req.get("authorization") || req.get("Authorization");
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
         
        const user = await User.findById(decodedToken.id).select('-password'); 
        
        if (!user) {
          return res.status(401).json({ success: false, error: "User not found" });
        }
        req.user = user;
       
         // If you want to set user in session for Passport.js
        return next();

      } catch (error) {
        
         return res.status(401).json({
        message: "Unauthorized - Invalid or expired token",
        error: error.message,
      });
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, error: "Token expired" });
        }
        if (process.env.NODE_ENV !== 'production') {
          console.warn("JWT verification failed:", error.message);
        }
      }
    }
  }

  // 3. Neither session nor token valid
  return res.status(401).json({
    message: "Unauthorized",
    statusCode: 401,
    errorData: null
  });
};



module.exports = {
 userAuthenticationCheck
}


//   const authHeader = req.get("Authorization");

//   if (!authHeader) {
//     return res.status(401).json({ success: false, error: "Not authenticated" });
//   }

//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ success: false, error: "Not authenticated" });
//   }

//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     return res.status(401).json({ success: false, error: "Not authenticated" });
//   }

//   if (!decodedToken) {
//     return res.status(401).json({ success: false, error: "Not authenticated" });
//   }
//   req.user = decodedToken;
//   next();

// };