const jwt = require('jsonwebtoken');
// const db = require('../models'); // Optionally check if user still exists in DB
// const User = db.User;

const verifyToken = (req, res, next) => {
  // Get token from header (common practice: 'Bearer TOKEN_STRING')
  let token = req.headers['authorization']; // Or 'x-access-token'

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  // Check if token is in 'Bearer <token>' format
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      // Differentiate between expired and invalid tokens
      if (err.name === 'TokenExpiredError') {
          return res.status(401).send({ message: 'Unauthorized! Token expired.' });
      }
      return res.status(401).send({ message: 'Unauthorized! Invalid token.' });
    }
    // If verification is successful, attach decoded user ID to request object
    req.userId = decoded.id;
    next(); // Move to the next middleware or route handler

    // Optional: Verify user still exists in DB
    // User.findByPk(decoded.id).then(user => {
    //   if (!user) {
    //     return res.status(401).send({ message: 'Unauthorized! User not found.' });
    //   }
    //   req.userId = decoded.id;
    //   next();
    // }).catch(dbErr => {
    //    console.error("DB check during JWT verify failed:", dbErr);
    //    res.status(500).send({ message: 'Internal server error during authentication.' });
    // });
  });
};

module.exports = { verifyToken };