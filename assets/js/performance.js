/**
 * Performance Optimization Script
 * Handles lazy loading, preloading, and smooth interactions
 */

(function() {
    'use strict';
    
    // Performance utilities
    const perf = {
        // Debounce utility for better performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle utility for scroll events
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        // Preload critical resources
        preloadResource: function(href, as, type) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = as;
            if (type) link.type = type;
            document.head.appendChild(link);
        },
        
        // Prefetch pages for faster navigation
        prefetchPage: function(url) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        },
        
        // Optimize images with lazy loading
        lazyLoadImages: function() {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        },
        
        // Optimize animations for better performance
        optimizeAnimations: function() {
            // Add will-change property to elements that will animate
            const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .button, .testimonial-item');
            animatedElements.forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
            
            // Remove will-change after animation completes
            document.addEventListener('animationend', (e) => {
                e.target.style.willChange = 'auto';
            });
        },
        
        // Optimize scrolling performance
        optimizeScrolling: function() {
            let ticking = false;
            
            const updateScrollEffects = () => {
                // Add/remove scroll-based classes efficiently
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const header = document.querySelector('.site-header');
                
                if (scrollTop > 100) {
                    header?.classList.add('scrolled');
                } else {
                    header?.classList.remove('scrolled');
                }
                
                ticking = false;
            };
            
            const onScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(updateScrollEffects);
                    ticking = true;
                }
            };
            
            window.addEventListener('scroll', onScroll, { passive: true });
        },
        
        // Optimize form interactions
        optimizeForms: function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Add loading states
                form.addEventListener('submit', (e) => {
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.classList.add('loading');
                        submitBtn.disabled = true;
                    }
                });
                
                // Real-time validation with debouncing
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    const validateField = perf.debounce(() => {
                        if (input.checkValidity()) {
                            input.classList.remove('error');
                            input.classList.add('valid');
                        } else {
                            input.classList.remove('valid');
                            input.classList.add('error');
                        }
                    }, 500);
                    
                    input.addEventListener('input', validateField);
                });
            });
        },
        
        // Optimize button interactions
        optimizeButtons: function() {
            const buttons = document.querySelectorAll('.button');
            buttons.forEach(button => {
                // Add loading state on click
                button.addEventListener('click', (e) => {
                    if (button.classList.contains('loading')) {
                        e.preventDefault();
                        return;
                    }
                    
                    // Add loading class with delay to prevent flashing
                    setTimeout(() => {
                        button.classList.add('loading');
                    }, 100);
                });
            });
        },
        
        // Remove loading states when page is fully loaded
        removeLoadingStates: function() {
            window.addEventListener('load', () => {
                document.querySelectorAll('.loading-placeholder').forEach(el => {
                    el.classList.remove('loading-placeholder');
                });
                
                document.querySelectorAll('.loading').forEach(el => {
                    el.classList.remove('loading');
                    if (el.disabled) el.disabled = false;
                });
            });
        },
        
        // Initialize all performance optimizations
        init: function() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupOptimizations();
                });
            } else {
                this.setupOptimizations();
            }
        },
        
        setupOptimizations: function() {
            // Remove transitions during initial load
            document.body.classList.add('no-transitions');
            
            // Initialize optimizations
            this.lazyLoadImages();
            this.optimizeAnimations();
            this.optimizeScrolling();
            this.optimizeForms();
            this.optimizeButtons();
            this.removeLoadingStates();
            
            // Preload critical resources
            this.preloadResource('/assets/css/style.css', 'style');
            this.preloadResource('/assets/js/script.js', 'script');
            
            // Prefetch critical pages
            const criticalPages = ['/about.html', '/apply.html', '/rainbow-cashflow.html'];
            criticalPages.forEach(page => this.prefetchPage(page));
            
            // Enable transitions after initial load
            setTimeout(() => {
                document.body.classList.remove('no-transitions');
            }, 100);
            
            // Initialize page-specific optimizations
            this.initPageSpecific();
        },
        
        initPageSpecific: function() {
            // Quiz modal optimization
            if (document.querySelector('.quiz-modal')) {
                this.optimizeQuizModal();
            }
            
            // Mobile menu optimization
            if (document.querySelector('.mobile-nav')) {
                this.optimizeMobileMenu();
            }
        },
        
        optimizeQuizModal: function() {
            const modal = document.querySelector('.quiz-modal');
            if (!modal) return;
            
            // Use transform for better performance
            modal.style.transform = 'translateZ(0)';
            
            // Optimize quiz interactions
            const quizButtons = modal.querySelectorAll('.quiz-option');
            quizButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Add smooth selection animation
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        },
        
        optimizeMobileMenu: function() {
            const mobileNav = document.querySelector('.mobile-nav');
            if (!mobileNav) return;
            
            // Use transform for better performance
            mobileNav.style.transform = 'translateZ(0)';
            
            // Optimize touch interactions
            mobileNav.style.touchAction = 'pan-y';
        }
    };
    
    // Initialize performance optimizations
    perf.init();
    
    // Expose utilities globally for other scripts
    window.PerfUtils = perf;
})(); 