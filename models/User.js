const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  
  // OAuth provider IDs
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  facebookId: {
    type: String,
    sparse: true,
    unique: true
  },
  linkedinId: {
    type: String,
    sparse: true,
    unique: true
  },
  
  // Authentication providers used
  providers: [{
    type: String,
    enum: ['local', 'google', 'facebook', 'linkedin']
  }],
  
  // Email verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  
  // Password reset
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Profile information for Polish + Bloom
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    city: String,
    province: String,
    supportAreas: [String],
    successDefinition: String,
    challengeTransform: String,
    experience: String,
    experienceDetails: String,
    referralSource: String,
    values: String
  },
  
  // Application status
  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'incomplete'],
    default: 'incomplete'
  },
  
  // Membership information
  membershipType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  // Referral information
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });
userSchema.index({ linkedinId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.referralCode = code;
  return code;
};

// Get user's full name
userSchema.virtual('fullName').get(function() {
  if (this.profile && this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.name;
});

// Get user's primary authentication method
userSchema.virtual('primaryProvider').get(function() {
  if (this.providers && this.providers.length > 0) {
    return this.providers[0];
  }
  return 'local';
});

// Transform JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema); 