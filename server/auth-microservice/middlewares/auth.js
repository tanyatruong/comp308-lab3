const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tanya_truong_comp308_lab3_jwt_secret';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return next();
  }
  
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