// Google Analytics 4 Configuration for Polish & Bloom
window.GA4_CONFIG = {
    measurementId: 'G-22HYW1XL8C', // Replace with your actual GA4 Measurement ID
    
    // Enhanced tracking configuration
    config: {
        // Basic settings
        send_page_view: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        
        // Privacy settings
        anonymize_ip: true,
        
        // Enhanced measurement (automatically enabled in GA4)
        enhanced_measurement: {
            scrolls: true,
            outbound_clicks: true,
            site_search: true,
            video_engagement: true,
            file_downloads: true
        }
    },
    
    // Custom events for Polish & Bloom
    events: {
        // Quiz tracking
        quiz_started: {
            event_name: 'quiz_started',
            parameters: {
                quiz_type: 'money_personality',
                event_category: 'engagement',
                event_label: 'quiz_interaction'
            }
        },
        
        quiz_completed: {
            event_name: 'quiz_completed',
            parameters: {
                quiz_type: 'money_personality',
                event_category: 'engagement',
                event_label: 'quiz_completion'
            }
        },
        
        // Form tracking
        form_submitted: {
            event_name: 'form_submit',
            parameters: {
                event_category: 'form',
                event_label: 'contact_form'
            }
        },
        
        // Navigation tracking
        mobile_menu_opened: {
            event_name: 'mobile_menu_opened',
            parameters: {
                event_category: 'navigation',
                event_label: 'mobile_interaction'
            }
        },
        
        // CTA tracking
        cta_clicked: {
            event_name: 'cta_clicked',
            parameters: {
                event_category: 'engagement',
                event_label: 'call_to_action'
            }
        },
        
        // Journey tracking
        page_journey_progress: {
            event_name: 'page_journey_progress',
            parameters: {
                event_category: 'user_journey',
                event_label: 'progress_tracking'
            }
        }
    }
};

// Initialize GA4
function initGA4() {
    const config = window.GA4_CONFIG;
    
    // Only initialize if measurement ID is set
    if (config.measurementId === 'G-XXXXXXXXXX') {
        console.warn('GA4: Please replace G-XXXXXXXXXX with your actual GA4 Measurement ID in config/ga4.js');
        return;
    }
    
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', config.measurementId, config.config);
    
    // Make gtag available globally
    window.gtag = gtag;
    
    console.log('GA4 initialized successfully');
}

// Custom event tracking functions
window.trackGA4Event = function(eventName, additionalParams = {}) {
    if (typeof gtag !== 'undefined') {
        const eventConfig = window.GA4_CONFIG.events[eventName];
        if (eventConfig) {
            const params = { ...eventConfig.parameters, ...additionalParams };
            gtag('event', eventConfig.event_name, params);
        } else {
            // Track custom event
            gtag('event', eventName, additionalParams);
        }
    }
};

// Page view tracking
window.trackGA4PageView = function(pagePath, pageTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('config', window.GA4_CONFIG.measurementId, {
            page_path: pagePath,
            page_title: pageTitle
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGA4);
} else {
    initGA4();
} 