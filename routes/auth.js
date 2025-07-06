const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' }
});

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper function to handle successful authentication
const handleAuthSuccess = (req, res, user) => {
  const token = generateToken(user);
  
  // Update last login
  user.lastLogin = new Date();
  user.save();
  
  // Set cookie with token
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  // Redirect based on application status
  if (user.applicationStatus === 'incomplete') {
    return res.redirect('/join?step=application');
  } else if (user.applicationStatus === 'approved') {
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/join?step=pending');
  }
};

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/join?error=google_auth_failed' }),
  (req, res) => {
    handleAuthSuccess(req, res, req.user);
  }
);

// Facebook OAuth routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/join?error=facebook_auth_failed' }),
  (req, res) => {
    handleAuthSuccess(req, res, req.user);
  }
);

// LinkedIn OAuth routes
router.get('/linkedin',
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })
);

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/join?error=linkedin_auth_failed' }),
  (req, res) => {
    handleAuthSuccess(req, res, req.user);
  }
);

// Local authentication - Sign Up
router.post('/signup', 
  authLimiter,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists',
          message: 'An account with this email already exists. Please sign in instead.'
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        providers: ['local'],
        emailVerified: false
      });

      await user.save();

      // Generate token and sign in user
      const token = generateToken(user);
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: user.toJSON(),
        redirectUrl: '/join?step=application'
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Unable to create account. Please try again.'
      });
    }
  }
);

// Local authentication - Sign In
router.post('/signin',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        });
      }

      // Generate token and sign in user
      const token = generateToken(user);
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Determine redirect URL based on application status
      let redirectUrl = '/dashboard';
      if (user.applicationStatus === 'incomplete') {
        redirectUrl = '/join?step=application';
      } else if (user.applicationStatus === 'pending') {
        redirectUrl = '/join?step=pending';
      }

      res.json({
        success: true,
        message: 'Signed in successfully',
        user: user.toJSON(),
        redirectUrl
      });

    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Unable to sign in. Please try again.'
      });
    }
  }
);

// Sign out
router.post('/signout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error signing out' });
    }
    
    res.clearCookie('auth_token');
    res.json({ success: true, message: 'Signed out successfully' });
  });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    res.json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit application
router.post('/application',
  [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('supportAreas').isArray({ min: 1 }).withMessage('Please select at least one support area')
  ],
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const {
        firstName,
        lastName,
        phone,
        city,
        province,
        supportAreas,
        successDefinition,
        challengeTransform,
        experience,
        experienceDetails,
        referralSource,
        values
      } = req.body;

      // Update user profile
      req.user.profile = {
        firstName,
        lastName,
        phone,
        city,
        province,
        supportAreas,
        successDefinition,
        challengeTransform,
        experience,
        experienceDetails,
        referralSource,
        values
      };

      req.user.applicationStatus = 'pending';
      await req.user.save();

      res.json({
        success: true,
        message: 'Application submitted successfully',
        redirectUrl: '/join?step=success'
      });

    } catch (error) {
      console.error('Application submission error:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Unable to submit application. Please try again.'
      });
    }
  }
);

module.exports = router; 