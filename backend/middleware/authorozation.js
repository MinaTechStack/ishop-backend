const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
  const token = req.cookies.admin_token; // ✅ use cookies

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authorize;
