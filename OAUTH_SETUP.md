# OAuth Setup Guide for Polish + Bloom

This guide will help you set up OAuth applications with Google, Facebook, and LinkedIn for the Polish + Bloom authentication system.

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local or cloud instance)
3. Developer accounts with Google, Facebook, and LinkedIn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp config/env.example .env
```

3. Update the `.env` file with your credentials (see setup guides below)

## OAuth Application Setup

### 1. Google OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

#### Step 2: Create OAuth Credentials
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen:
   - Application name: "Polish + Bloom"
   - User support email: your email
   - Developer contact: your email
4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "Polish + Bloom Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

#### Step 3: Configure Environment Variables
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Facebook OAuth Setup

#### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App name: "Polish + Bloom"
   - Contact email: your email

#### Step 2: Configure Facebook Login
1. Add "Facebook Login" product to your app
2. Go to Facebook Login > Settings
3. Configure Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/facebook/callback` (development)
   - `https://yourdomain.com/api/auth/facebook/callback` (production)

#### Step 3: Configure Environment Variables
```env
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 3. LinkedIn OAuth Setup

#### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in app details:
   - App name: "Polish + Bloom"
   - LinkedIn Page: Create or select your company page
   - App logo: Upload your logo
   - Privacy policy URL: Your privacy policy URL
   - Terms of service URL: Your terms of service URL

#### Step 2: Configure OAuth Settings
1. Go to "Auth" tab in your app
2. Add OAuth 2.0 redirect URLs:
   - `http://localhost:3000/api/auth/linkedin/callback` (development)
   - `https://yourdomain.com/api/auth/linkedin/callback` (production)
3. Request access to:
   - `r_liteprofile` (basic profile info)
   - `r_emailaddress` (email address)

#### Step 3: Configure Environment Variables
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

## Database Setup

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `polish-bloom-auth`
3. Update the connection string in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/polish-bloom-auth
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/polish-bloom-auth
```

## Security Configuration

### JWT Secret
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=your_generated_jwt_secret
SESSION_SECRET=your_generated_session_secret
```

### Production Security
For production deployment:
1. Set `NODE_ENV=production`
2. Use HTTPS for all URLs
3. Update CORS settings for your domain
4. Configure proper SSL certificates
5. Use environment variables for all secrets

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Testing OAuth Integration

### Test Flow
1. Visit `http://localhost:3000/join`
2. Click on social login buttons
3. Complete OAuth flow
4. Verify user creation in database
5. Test application submission

### Common Issues

#### Google OAuth
- **Error: redirect_uri_mismatch**
  - Solution: Ensure redirect URI in Google Console matches exactly
- **Error: access_denied**
  - Solution: Check OAuth consent screen configuration

#### Facebook OAuth
- **Error: URL blocked**
  - Solution: Add domain to Valid OAuth Redirect URIs
- **Error: App not live**
  - Solution: Submit app for review or add test users

#### LinkedIn OAuth
- **Error: invalid_redirect_uri**
  - Solution: Verify redirect URL in LinkedIn app settings
- **Error: access_denied**
  - Solution: Check app permissions and verification status

## API Endpoints

### Authentication Endpoints
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/facebook` - Initiate Facebook OAuth
- `GET /api/auth/linkedin` - Initiate LinkedIn OAuth
- `POST /api/auth/signin` - Email/password sign in
- `POST /api/auth/signup` - Email/password sign up
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/application` - Submit application

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Delete account

## Frontend Integration

The frontend JavaScript automatically handles:
- OAuth redirects
- Form submissions
- Error handling
- Success redirects
- Loading states

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_production_mongodb_uri
FRONTEND_URL=https://yourdomain.com
SUCCESS_REDIRECT_URL=https://yourdomain.com/dashboard
FAILURE_REDIRECT_URL=https://yourdomain.com/join?error=auth_failed
```

### Deployment Platforms
- **Heroku**: Add buildpack for Node.js
- **Vercel**: Configure serverless functions
- **DigitalOcean**: Use App Platform or Droplets
- **AWS**: Use Elastic Beanstalk or EC2

## Monitoring and Logs

### Error Logging
The application logs OAuth errors to the console. In production, consider:
- Winston for structured logging
- Sentry for error tracking
- MongoDB logging for audit trails

### Analytics
Track OAuth conversion rates:
- Google Analytics events
- Custom database metrics
- User journey analysis

## Support

For issues with OAuth setup:
1. Check the console logs for detailed error messages
2. Verify all redirect URIs match exactly
3. Ensure all required scopes are requested
4. Test with different browsers and incognito mode
5. Check OAuth provider documentation for updates

## Next Steps

After successful OAuth setup:
1. Configure email notifications
2. Set up user onboarding flow
3. Implement admin dashboard
4. Add user analytics
5. Configure backup and monitoring 