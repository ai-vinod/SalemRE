const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

/**
 * Middleware to restrict access to admin users only
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };