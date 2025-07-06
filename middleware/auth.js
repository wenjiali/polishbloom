const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to check if user is authenticated (for routes that need login)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      redirectUrl: '/join'
    });
  }
  next();
};

// Middleware to check if user has completed application
const requireApplication = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      redirectUrl: '/join'
    });
  }
  
  if (req.user.applicationStatus === 'incomplete') {
    return res.status(403).json({ 
      error: 'Application required',
      redirectUrl: '/join?step=application'
    });
  }
  
  next();
};

// Middleware to check if user has approved application
const requireApproval = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      redirectUrl: '/join'
    });
  }
  
  if (req.user.applicationStatus !== 'approved') {
    return res.status(403).json({ 
      error: 'Application approval required',
      redirectUrl: '/join?step=pending'
    });
  }
  
  next();
};

// Middleware to attach user to request if authenticated (optional auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAuth,
  requireApplication,
  requireApproval,
  optionalAuth
}; 