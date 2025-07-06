# Client-Side OAuth 2.0 Setup Guide

This guide shows you how to implement OAuth 2.0 authentication purely on the client-side without any backend server or database.

## Overview

Client-side OAuth uses:
- **Google**: OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- **Facebook**: Facebook SDK for JavaScript
- **LinkedIn**: OAuth 2.0 Implicit Flow
- **Local Storage**: For storing authentication tokens

## Prerequisites

- Developer accounts with Google, Facebook, and LinkedIn
- Your website domain (for production) or localhost (for development)

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Polish + Bloom"
3. Enable the **Google+ API** and **Google Identity Services**

### Step 2: Create OAuth Client
1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
2. Configure OAuth consent screen:
   - Application name: "Polish + Bloom"
   - User support email: your email
   - Authorized domains: `localhost` (dev) and your domain (prod)
3. Create OAuth Client:
   - Application type: **Web application**
   - Name: "Polish + Bloom Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/join.html` (development)
     - `https://yourdomain.com/join.html` (production)

### Step 3: Get Your Client ID
Copy your **Client ID** - you'll need this in your HTML.

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create App → **Consumer** app type
3. App name: "Polish + Bloom"

### Step 2: Configure Facebook Login
1. Add **Facebook Login** product
2. Go to Facebook Login → **Settings**
3. Configure:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/join.html`
     - `https://yourdomain.com/join.html`
   - Valid JavaScript Origins:
     - `http://localhost:3000`
     - `https://yourdomain.com`

### Step 3: Get Your App ID
Copy your **App ID** from the app dashboard.

## 3. LinkedIn OAuth Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create App:
   - App name: "Polish + Bloom"
   - LinkedIn Page: Your company page
   - Privacy policy: Your privacy policy URL

### Step 2: Configure OAuth
1. Go to **Auth** tab
2. Add redirect URLs:
   - `http://localhost:3000/join.html`
   - `https://yourdomain.com/join.html`
3. Request permissions:
   - `r_liteprofile` (basic profile)
   - `r_emailaddress` (email address)

### Step 3: Get Your Client ID
Copy your **Client ID** from the app settings.

## 4. Implementation

### HTML Structure
```html
<!-- Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Facebook SDK -->
<script async defer crossorigin="anonymous" 
        src="https://connect.facebook.net/en_US/sdk.js"></script>

<!-- Your OAuth buttons -->
<button onclick="signInWithGoogle()">Continue with Google</button>
<button onclick="signInWithFacebook()">Continue with Facebook</button>
<button onclick="signInWithLinkedIn()">Continue with LinkedIn</button>
```

### JavaScript Implementation
```javascript
// Configuration
const OAUTH_CONFIG = {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        redirectUri: window.location.origin + '/join.html'
    },
    facebook: {
        appId: 'YOUR_FACEBOOK_APP_ID'
    },
    linkedin: {
        clientId: 'YOUR_LINKEDIN_CLIENT_ID',
        redirectUri: window.location.origin + '/join.html'
    }
};

// Google OAuth
function signInWithGoogle() {
    google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CONFIG.google.clientId,
        scope: 'profile email',
        callback: handleGoogleCallback
    }).requestAccessToken();
}

// Facebook OAuth  
function signInWithFacebook() {
    FB.login(handleFacebookCallback, {scope: 'email'});
}

// LinkedIn OAuth
function signInWithLinkedIn() {
    const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${OAUTH_CONFIG.linkedin.clientId}&` +
        `redirect_uri=${encodeURIComponent(OAUTH_CONFIG.linkedin.redirectUri)}&` +
        `scope=r_liteprofile%20r_emailaddress`;
    
    window.location.href = linkedinUrl;
}
```

## 5. Security Considerations

### Token Storage
- Store tokens in `sessionStorage` (cleared when tab closes)
- Never store in `localStorage` for sensitive data
- Use short-lived tokens when possible

### CSRF Protection
- Use `state` parameter for OAuth flows
- Validate the `state` parameter on return

### HTTPS Only
- Always use HTTPS in production
- OAuth providers require HTTPS for security

## 6. Testing

### Development Testing
1. Start a local server: `npx live-server`
2. Visit `http://localhost:3000/join.html`
3. Test each OAuth provider

### Production Deployment
1. Deploy to your domain with HTTPS
2. Update OAuth app configurations with production URLs
3. Test all flows in production environment

## 7. Error Handling

Common issues and solutions:

### Google
- **Error: redirect_uri_mismatch** → Check authorized redirect URIs
- **Error: invalid_client** → Verify client ID is correct

### Facebook  
- **Error: URL blocked** → Add domain to valid OAuth redirect URIs
- **Error: App not live** → Submit for review or add test users

### LinkedIn
- **Error: invalid_redirect_uri** → Verify redirect URI in app settings
- **Error: unauthorized_client** → Check client ID and app permissions

## 8. User Experience Flow

1. **User clicks OAuth button**
2. **Redirected to provider** (Google/Facebook/LinkedIn)
3. **User authorizes app**
4. **Redirected back with token/code**
5. **Store user info in sessionStorage**
6. **Show dashboard or next step**

## 9. Data Storage Without Database

Since there's no database, store user data in:
- **sessionStorage**: Temporary session data
- **localStorage**: Persistent user preferences
- **URL parameters**: Pass data between pages
- **Form data**: Collect additional info as needed

## 10. Deployment Options

### Static Hosting (Recommended)
- **Vercel**: Zero-config deployment
- **Netlify**: Easy HTTPS and redirects
- **GitHub Pages**: Free hosting for public repos
- **Cloudflare Pages**: Fast global CDN

### Configuration for Static Hosting
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1.html" }
  ]
}
```

This approach gives you a fully functional OAuth system without any backend infrastructure! 