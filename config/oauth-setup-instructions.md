# OAuth Setup Instructions for Polish + Bloom

## 🚨 **Quick Fix for "Error 401: invalid_client"**

You're getting this error because the Google Client ID is not properly configured. Here's how to fix it:

### **Step 1: Get Your Google Client ID**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**: Create "Polish + Bloom" project
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google+ API"
   - Search and enable "Identity and Access Management (IAM) API"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials" 
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Configure:
     - **Name**: Polish + Bloom Website
     - **Authorized JavaScript origins**:
       - `http://localhost:3000` (for testing)
       - `https://yourdomain.com` (replace with your actual domain)
     - **Authorized redirect URIs**:
       - `http://localhost:3000/join.html`
       - `https://yourdomain.com/join.html`

5. **Copy the Client ID**: It looks like `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

### **Step 2: Update Your Configuration**

Edit the file `config/oauth.js` and replace:

```javascript
clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
```

With your actual Client ID:

```javascript
clientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
```

### **Step 3: Test the Setup**

1. Save the file
2. Refresh your website
3. Try Google OAuth again

---

## 🔧 **Complete OAuth Setup for All Providers**

### **Facebook OAuth Setup**

1. Go to https://developers.facebook.com/
2. Create a new app → "Business" type
3. Add "Facebook Login" product
4. In Settings → Basic:
   - Copy your **App ID**
   - Add your domain to **App Domains**
5. In Facebook Login → Settings:
   - Add redirect URIs: `https://yourdomain.com/join.html`
6. Update `config/oauth.js` with your App ID

### **LinkedIn OAuth Setup**

1. Go to https://www.linkedin.com/developers/
2. Create a new app
3. Add "Sign In with LinkedIn" product
4. In Auth tab:
   - Add redirect URLs: `https://yourdomain.com/join.html`
5. Copy the **Client ID**
6. Update `config/oauth.js` with your Client ID

---

## 🛠 **Testing Configuration**

After updating `config/oauth.js`, you can test if everything is working:

1. Open browser console (F12)
2. Look for any warnings about missing OAuth configuration
3. Try each OAuth provider
4. Check for specific error messages

---

## 📋 **Common Issues & Solutions**

### **"invalid_client" Error**
- ✅ **Solution**: Update the Client ID in `config/oauth.js`
- ✅ **Check**: Make sure your domain is in authorized origins

### **"redirect_uri_mismatch" Error**  
- ✅ **Solution**: Add your exact URL to authorized redirect URIs
- ✅ **Check**: URL must match exactly (http vs https, www vs no-www)

### **"access_denied" Error**
- ✅ **Solution**: User cancelled or app not approved
- ✅ **Check**: Make sure app is in "Live" mode (not Development)

---

## 🔒 **Security Best Practices**

1. **Never commit real OAuth credentials to public repositories**
2. **Use environment variables for production**
3. **Keep Client Secrets secure** (only needed for server-side)
4. **Regularly rotate credentials**
5. **Monitor OAuth usage in provider dashboards**

---

## 🚀 **Production Deployment Checklist**

- [ ] Replace all `YOUR_*` placeholders with real credentials
- [ ] Add production domain to all OAuth provider settings
- [ ] Test all OAuth flows on production domain
- [ ] Set up proper error monitoring
- [ ] Configure HTTPS (required for OAuth)

---

Need help? Check the browser console for specific error messages and refer to this guide! 