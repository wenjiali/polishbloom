# Google Analytics 4 (GA4) Setup for Polish & Bloom

## Step 1: Create Your GA4 Property

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Click "Start measuring"** (or "Admin" if you have an existing account)
3. **Create Account**:
   - Account name: `Polish & Bloom`
   - Data sharing settings: Keep defaults checked
4. **Create Property**:
   - Property name: `Polish & Bloom Website`
   - Reporting time zone: Choose your timezone
   - Currency: Choose your currency
5. **Choose Platform**: Select "Web"
6. **Set up data stream**:
   - Website URL: `https://www.polishandbloom.com`
   - Stream name: `Polish & Bloom Main Site`
   - Enhanced measurement: **Keep all options enabled**

## Step 2: Get Your Measurement ID

After creating the property, you'll see a **Measurement ID** that looks like:
```
G-XXXXXXXXXX
```

**Copy this ID** - you'll need it for the next step.

## Step 3: Implement GA4 Code

Your GA4 code will be automatically added to all pages via the configuration file I'm creating.

## Step 4: Set Up Enhanced Tracking

GA4 will automatically track:
- ✅ Page views
- ✅ Scrolling (90% depth)
- ✅ Outbound clicks
- ✅ Site search
- ✅ Video engagement
- ✅ File downloads

## Step 5: Custom Events for Polish & Bloom

The implementation includes custom events specific to your site:
- `quiz_started` - When users start the money personality quiz
- `quiz_completed` - When users complete the quiz
- `form_submitted` - When users submit contact forms
- `mobile_menu_opened` - Mobile navigation tracking
- `cta_clicked` - Smart CTA button clicks
- `page_journey_progress` - User journey progression

## Step 6: Goals & Conversions

In GA4, set up these key conversions:
1. **Quiz Completion** (quiz_completed)
2. **Form Submission** (form_submitted) 
3. **Join Page Visit** (page_view on /join.html)
4. **Contact Form Opens** (contact_form_opened)

## Step 7: Audiences

Create audiences for:
- **Quiz Takers**: Users who completed the quiz
- **Form Submitters**: Users who submitted forms
- **Mobile Users**: Users on mobile devices
- **Engaged Users**: Users who spent 2+ minutes on site

## Step 8: Reports to Monitor

Key reports for Polish & Bloom:
- **Real-time**: Live user activity
- **Engagement**: Page views, time on site, bounce rate
- **Conversions**: Form submissions, quiz completions
- **Demographics**: User age, gender, location
- **Technology**: Device types, browsers
- **Acquisition**: How users find your site

## Step 9: Privacy & Compliance

The implementation includes:
- ✅ Consent management ready
- ✅ Anonymous IP collection
- ✅ Data retention controls
- ✅ GDPR compliance features

## Step 10: Testing

After setup:
1. Visit your site in a new browser/incognito window
2. Navigate through different pages
3. Check GA4 Real-time reports (may take 5-10 minutes to appear)
4. Submit a test form to verify event tracking

## Amplitude vs GA4

**Keep Both For:**
- Amplitude: Advanced user behavior analytics, funnels, cohorts
- GA4: Standard web analytics, SEO insights, Google Ads integration

**Benefits of Using Both:**
- Comprehensive tracking coverage
- Cross-validation of data
- Different analytics perspectives
- Backup if one service has issues

## Support

If you need help:
- GA4 Help Center: https://support.google.com/analytics/
- Polish & Bloom specific tracking is handled automatically
- All custom events are pre-configured for your site structure 