const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', 
  requireAuth,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('profile.firstName').optional().trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('profile.lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name is required')
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

      const allowedUpdates = ['name', 'profile'];
      const updates = {};

      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      // Special handling for email updates
      if (req.body.email && req.body.email !== req.user.email) {
        // Check if email is already taken
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({
            error: 'Email already exists',
            message: 'This email is already associated with another account'
          });
        }
        updates.email = req.body.email;
        updates.emailVerified = false; // Reset email verification
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: user.toJSON()
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Unable to update profile. Please try again.'
      });
    }
  }
);

// Change password
router.put('/password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
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

      const { currentPassword, newPassword } = req.body;

      // Check if user has a password (not OAuth-only user)
      if (!req.user.password) {
        return res.status(400).json({
          error: 'Password not set',
          message: 'You signed up with a social account. Please use the forgot password feature to set a password.'
        });
      }

      // Verify current password
      const isMatch = await req.user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'Current password is incorrect'
        });
      }

      // Update password
      req.user.password = newPassword;
      await req.user.save();

      res.json({
        success: true,
        message: 'Password updated successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'Unable to change password. Please try again.'
      });
    }
  }
);

// Delete account
router.delete('/account', requireAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    
    // Clear session and cookie
    req.logout((err) => {
      if (err) {
        console.error('Logout error during account deletion:', err);
      }
    });
    
    res.clearCookie('auth_token');
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Unable to delete account. Please try again.'
    });
  }
});

// Get user's referral code
router.get('/referral-code', requireAuth, async (req, res) => {
  try {
    if (!req.user.referralCode) {
      req.user.generateReferralCode();
      await req.user.save();
    }

    res.json({
      success: true,
      referralCode: req.user.referralCode
    });

  } catch (error) {
    console.error('Get referral code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Link social account
router.post('/link/:provider', requireAuth, async (req, res) => {
  try {
    const { provider } = req.params;
    
    if (!['google', 'facebook', 'linkedin'].includes(provider)) {
      return res.status(400).json({
        error: 'Invalid provider',
        message: 'Provider must be google, facebook, or linkedin'
      });
    }

    // This would typically redirect to OAuth flow
    // For now, we'll return the OAuth URL
    const oauthUrls = {
      google: '/api/auth/google',
      facebook: '/api/auth/facebook',
      linkedin: '/api/auth/linkedin'
    };

    res.json({
      success: true,
      message: `Redirect to ${provider} OAuth`,
      oauthUrl: oauthUrls[provider]
    });

  } catch (error) {
    console.error('Link account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlink social account
router.delete('/unlink/:provider', requireAuth, async (req, res) => {
  try {
    const { provider } = req.params;
    
    if (!['google', 'facebook', 'linkedin'].includes(provider)) {
      return res.status(400).json({
        error: 'Invalid provider',
        message: 'Provider must be google, facebook, or linkedin'
      });
    }

    // Check if user has other authentication methods
    if (req.user.providers.length === 1 && !req.user.password) {
      return res.status(400).json({
        error: 'Cannot unlink',
        message: 'You must have at least one authentication method. Please set a password first.'
      });
    }

    // Remove provider ID and from providers array
    const providerIdField = `${provider}Id`;
    req.user[providerIdField] = undefined;
    req.user.providers = req.user.providers.filter(p => p !== provider);
    
    await req.user.save();

    res.json({
      success: true,
      message: `${provider} account unlinked successfully`
    });

  } catch (error) {
    console.error('Unlink account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 