// OAuth Configuration
// Replace these placeholder values with your actual OAuth credentials

window.OAUTH_CONFIG = {
    google: {
        clientId: '77604655598-6si87ikiv96efid0q4rke228p3npkb40.apps.googleusercontent.com'
        // To get your Google Client ID:
        // 1. Go to https://console.cloud.google.com/
        // 2. Create a new project or select existing
        // 3. Enable Google+ API and OAuth2 API
        // 4. Go to APIs & Services → Credentials
        // 5. Create OAuth client ID → Web application
        // 6. Add your domain to authorized origins
        // 7. Copy the client ID here
    },
    
    facebook: {
        appId: 'YOUR_FACEBOOK_APP_ID'
        // To get your Facebook App ID:
        // 1. Go to https://developers.facebook.com/
        // 2. Create a new app → Business
        // 3. Add Facebook Login product
        // 4. Configure OAuth redirect URIs
        // 5. Copy the App ID here
    },
    
    linkedin: {
        clientId: 'YOUR_LINKEDIN_CLIENT_ID',
        redirectUri: window.location.origin + '/join.html',
        state: Math.random().toString(36).substring(2, 15)
        // To get your LinkedIn Client ID:
        // 1. Go to https://www.linkedin.com/developers/
        // 2. Create a new app
        // 3. Add Sign In with LinkedIn product
        // 4. Configure redirect URLs
        // 5. Copy the Client ID here
    }
};

// Development vs Production configuration
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development configuration
    console.log('🚀 Running in development mode');
    
    // You can override settings for local development here
    // window.OAUTH_CONFIG.google.clientId = 'your-dev-client-id';
} else {
    // Production configuration
    console.log('🌐 Running in production mode');
    
    // Ensure all OAuth providers are properly configured
    const missingConfigs = [];
    
    if (window.OAUTH_CONFIG.google.clientId.includes('YOUR_GOOGLE')) {
        missingConfigs.push('Google');
    }
    if (window.OAUTH_CONFIG.facebook.appId.includes('YOUR_FACEBOOK')) {
        missingConfigs.push('Facebook');
    }
    if (window.OAUTH_CONFIG.linkedin.clientId.includes('YOUR_LINKEDIN')) {
        missingConfigs.push('LinkedIn');
    }
    
    if (missingConfigs.length > 0) {
        console.warn('⚠️ Missing OAuth configuration for:', missingConfigs.join(', '));
        console.warn('Please update config/oauth.js with your actual OAuth credentials');
    }
} 