const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tanya_truong_comp308_lab3_jwt_secret';

// Check if user is authenticated
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return next();
  }
  
  // Verify token and attach user to request object
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    next();
  }
};

module.exports = authMiddleware;