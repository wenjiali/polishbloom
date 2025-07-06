document.addEventListener('DOMContentLoaded', () => {
    // --- UX IMPROVEMENTS: Smart CTA Management ---
    const initSmartCTAs = () => {
        // Track user journey state
        const userJourney = {
            hasVisitedAbout: sessionStorage.getItem('visited-about') === 'true',
            hasSeenQuiz: sessionStorage.getItem('seen-quiz') === 'true',
            hasOpenedContact: sessionStorage.getItem('opened-contact') === 'true',
            entryPage: sessionStorage.getItem('entry-page') || window.location.pathname
        };

        // Set entry page if first visit
        if (!sessionStorage.getItem('entry-page')) {
            sessionStorage.setItem('entry-page', window.location.pathname);
        }

        // Update CTAs based on user journey
        updateCTAMessaging(userJourney);
        
        // Track page visits
        trackPageVisit();
    };

    const updateCTAMessaging = (journey) => {
        const ctaButtons = document.querySelectorAll('.js-smart-cta');
        ctaButtons.forEach(btn => {
            const context = btn.dataset.context || 'general';
            const smartText = getSmartCTAText(context, journey);
            if (smartText && btn.textContent !== smartText) {
                btn.textContent = smartText;
            }
            
            // Add click tracking for CTA buttons
            btn.addEventListener('click', () => {
                // Track with both analytics
                if (window.amplitude) {
                    window.amplitude.track('CTA Clicked', { 
                        context: context,
                        text: btn.textContent,
                        page: window.location.pathname 
                    });
                }
                
                if (window.trackGA4Event) {
                    window.trackGA4Event('cta_clicked', {
                        context: context,
                        text: btn.textContent,
                        page_path: window.location.pathname
                    });
                }
            });
        });
    };

    const getSmartCTAText = (context, journey) => {
        switch (context) {
            case 'hero-primary':
                return journey.hasSeenQuiz ? 'Continue Your Journey' : 'Apply to Join';
            case 'hero-secondary':
                return journey.hasVisitedAbout ? 'Explore Programs' : 'Learn More';
            case 'quiz-prompt':
                return journey.hasSeenQuiz ? 'Retake Quiz' : 'Find Your Circle';
            case 'contact-general':
                return journey.hasOpenedContact ? 'Get in Touch Again' : 'Get in Touch';
            case 'apply':
                return journey.hasSeenQuiz ? 'Apply Now' : 'Take Quiz & Apply';
            default:
                return null;
        }
    };

    const trackPageVisit = () => {
        const currentPage = window.location.pathname;
        if (currentPage.includes('about')) {
            sessionStorage.setItem('visited-about', 'true');
        }
        if (document.getElementById('quiz-modal')) {
            sessionStorage.setItem('seen-quiz', 'true');
        }
    };

    // --- UX IMPROVEMENTS: Loading States ---
    const addLoadingState = (element, duration = 1000) => {
        const originalText = element.textContent;
        const originalDisabled = element.disabled;
        
        element.disabled = true;
        element.classList.add('loading');
        
        // Add loading animation
        if (!element.querySelector('.loading-spinner')) {
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            spinner.innerHTML = '&nbsp;<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M14,6l-8.58,8.58"/><path d="M2,12l8.58,8.58"/></svg>';
            element.appendChild(spinner);
        }
        
        element.textContent = element.dataset.loadingText || 'Loading...';
        
        setTimeout(() => {
            element.disabled = originalDisabled;
            element.classList.remove('loading');
            element.textContent = originalText;
            const spinner = element.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
        }, duration);
    };

    // --- UX IMPROVEMENTS: Enhanced Mobile Navigation ---
    const enhanceMobileNavigation = () => {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavScrim = document.getElementById('mobile-nav-scrim');

        if (!hamburgerBtn || !mobileNav) return;

        // Add breadcrumb to mobile nav
        const breadcrumb = createMobileBreadcrumb();
        if (breadcrumb) {
            mobileNav.insertBefore(breadcrumb, mobileNav.firstChild);
        }

        // Enhance mobile nav with better gestures
        let touchStartY = 0;
        let touchEndY = 0;

        mobileNav.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        });

        mobileNav.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            const swipeDistance = touchStartY - touchEndY;
            
            // Close on swipe right (only if significant swipe)
            if (swipeDistance < -100) {
                const isOpened = hamburgerBtn.getAttribute('aria-expanded') === 'true';
                if (isOpened) {
                    toggleMobileMenu();
                }
            }
        });

        const toggleMobileMenu = () => {
            const isOpened = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            document.body.classList.toggle('mobile-nav-open');
            hamburgerBtn.setAttribute('aria-expanded', !isOpened);
            mobileNavScrim.classList.toggle('hidden');
            
            // Add analytics tracking with both platforms
            if (window.amplitude) {
                window.amplitude.track('Mobile Menu Toggled', { opened: !isOpened });
            }
            
            // Track with GA4
            if (window.trackGA4Event) {
                window.trackGA4Event('mobile_menu_opened', {
                    menu_state: !isOpened ? 'opened' : 'closed'
                });
            }
        };

        hamburgerBtn.addEventListener('click', toggleMobileMenu);
        mobileNavScrim.addEventListener('click', toggleMobileMenu);
    };

    const createMobileBreadcrumb = () => {
        const currentPage = window.location.pathname;
        const pageNames = {
            '/index.html': 'Home',
            '/about.html': 'About',
            '/bloom-circles.html': 'Bloom Circles',
            '/rainbow-cashflow.html': 'Rainbow Cashflow',
            '/stories.html': 'Stories',
            '/blog.html': 'Blog',
            '/join.html': 'Create Account',
            '/apply.html': 'Apply'
        };

        const pageName = pageNames[currentPage] || 'Polish + Bloom';
        
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'mobile-breadcrumb';
        breadcrumb.innerHTML = `
            <div class="breadcrumb-content">
                <span class="current-page">${pageName}</span>
                <small>Swipe right to close</small>
            </div>
        `;
        
        return breadcrumb;
    };

    // --- UX IMPROVEMENTS: Form Enhancement ---
    const enhanceFormExperience = () => {
        // Add real-time validation
        const formInputs = document.querySelectorAll('input[required], textarea[required]');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });

        // Form submission enhancement
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmission);
        });
    };

    const validateField = (e) => {
        const field = e.target;
        const value = field.value.trim();
        
        if (!value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        clearFieldError(e);
        return true;
    };

    const showFieldError = (field, message) => {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
        
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    };

    const clearFieldError = (e) => {
        const field = e.target;
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleFormSubmission = (e) => {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate all required fields
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Focus on first error field
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }
        
        // Add loading state
        addLoadingState(submitBtn, 2000);
        
        // Track form submission
        const formType = form.id || 'unknown';
        if (window.amplitude) {
            window.amplitude.track('Form Submitted', { 
                form_type: formType,
                page: window.location.pathname 
            });
        }
        
        if (window.trackGA4Event) {
            window.trackGA4Event('form_submitted', {
                form_type: formType,
                page_path: window.location.pathname
            });
        }
        
        // Simulate form processing
        setTimeout(() => {
            showFormSuccess(form);
        }, 2000);
    };

    const showFormSuccess = (form) => {
        const successDiv = form.parentNode.querySelector('.form-success') || 
                          document.getElementById('form-success-message');
        
        if (successDiv) {
            successDiv.classList.remove('hidden');
            successDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset form
        form.reset();
        
        // Track success
        if (window.amplitude) {
            window.amplitude.track('Form Submission Success', { 
                form_type: form.id || 'unknown' 
            });
        }
        
        if (window.trackGA4Event) {
            window.trackGA4Event('form_submission_success', {
                form_type: form.id || 'unknown'
            });
        }
    };

    // Initialize all UX improvements
    initSmartCTAs();
    enhanceMobileNavigation();
    enhanceFormExperience();

    // --- EXISTING CODE: Mini Plan Modal ---
    const miniPlanModal = document.getElementById('mini-plan-modal');
    const miniPlanScrim = document.getElementById('mini-plan-scrim');

    if (miniPlanModal) {
        const miniPlanContent = document.getElementById('mini-plan-content');
        const closeMiniPlanBtns = document.querySelectorAll('.close-mini-plan');

        const planData = {
            red: {
                title: 'Survival',
                description: 'Essential needs—housing, groceries, utilities—covered with calm and clarity.',
                items: ['Rent/Mortgage', 'Groceries', 'Utilities', 'Transportation', 'Insurance'],
                ctaText: 'Get Started with Survival Planning'
            },
            orange: {
                title: 'Lifestyle',
                description: 'Day-to-day comforts and joys that make life sustainable and enjoyable.',
                items: ['Dining Out', 'Entertainment', 'Hobbies', 'Personal Care', 'Small Indulgences'],
                ctaText: 'Design Your Joy Budget'
            },
            yellow: {
                title: 'Dreams',
                description: 'Save for your biggest, most exciting goals and aspirations.',
                items: ['Travel Goals', 'Creative Projects', 'Business Ideas', 'Major Purchases', 'Life Adventures'],
                ctaText: 'Start Your Dream Fund'
            },
            green: {
                title: 'Growth',
                description: 'Invest in personal and professional development.',
                items: ['Courses & Education', 'Coaching/Mentoring', 'Skills Development', 'Professional Tools', 'Books & Learning'],
                ctaText: 'Invest in Growth'
            },
            blue: {
                title: 'Security',
                description: 'Build your long-term safety net and financial peace of mind.',
                items: ['Emergency Fund', 'Retirement Savings', 'Insurance', 'Investments', 'Long-term Security'],
                ctaText: 'Secure Your Future'
            },
            purple: {
                title: 'Education',
                description: 'Continuous learning and skill development for life enrichment.',
                items: ['Language Learning', 'Workshops', 'Conferences', 'Certifications', 'Educational Travel'],
                ctaText: 'Expand Your Knowledge'
            },
            pink: {
                title: 'Giving Back',
                description: 'Contribute to causes you care about and circulate love and impact.',
                items: ['Charitable Donations', 'Community Support', 'Generous Tipping', 'Helping Friends', 'Social Impact'],
                ctaText: 'Start Giving'
            }
        };

        function openMiniPlanModal(color, colorValue) {
            const data = planData[color];
            if (!data) return;

            miniPlanContent.innerHTML = `
                <div class="mini-plan-header" style="background: linear-gradient(135deg, ${colorValue}, ${colorValue}CC);">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                </div>
                <div class="mini-plan-body">
                    <h4>Typical Categories:</h4>
                    <ul>
                        ${data.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <div class="mini-plan-cta">
                        <a href="apply.html" class="button button-primary">${data.ctaText}</a>
                    </div>
                </div>
            `;

            miniPlanModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeMiniPlanModal() {
            miniPlanModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        closeMiniPlanBtns.forEach(btn => {
            btn.addEventListener('click', closeMiniPlanModal);
        });

        miniPlanScrim.addEventListener('click', closeMiniPlanModal);

        // Add click handlers to rainbow colors
        const rainbowColors = document.querySelectorAll('.rainbow-color');
        rainbowColors.forEach(color => {
            color.addEventListener('click', (e) => {
                e.preventDefault();
                const colorClass = color.className.split(' ').find(cls => cls.includes('color-'));
                const colorValue = getComputedStyle(color).backgroundColor;
                const colorName = colorClass ? colorClass.replace('color-', '') : 'red';
                openMiniPlanModal(colorName, colorValue);
            });
        });
    }

    // --- EXISTING CODE: Contact Modal ---
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        const contactForm = document.getElementById('contact-form');
        const contactModalTitle = document.getElementById('contact-modal-title');
        const contactSuccessMessage = document.getElementById('form-success-message');
        const openContactBtns = document.querySelectorAll('.js-open-contact-modal');
        const closeContactBtn = document.getElementById('close-contact-btn');

        const openContactModal = (title = 'Get in Touch') => {
            contactModalTitle.textContent = title;
            contactModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Track modal opening
            sessionStorage.setItem('opened-contact', 'true');
            
            if (window.amplitude) {
                window.amplitude.track('Contact Modal Opened', { 
                    title: title,
                    page: window.location.pathname 
                });
            }
            
            if (window.trackGA4Event) {
                window.trackGA4Event('contact_modal_opened', {
                    modal_title: title,
                    page_path: window.location.pathname
                });
            }
        };

        const closeContactModal = () => {
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Reset form and hide success message
            contactForm.classList.remove('hidden');
            contactSuccessMessage.classList.add('hidden');
            contactForm.reset();
        };

        openContactBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = btn.dataset.title || 'Get in Touch';
                openContactModal(title);
            });
        });

        closeContactBtn.addEventListener('click', closeContactModal);

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });

        // Enhanced contact form handling
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            addLoadingState(submitBtn, 2000);
            
            // Collect form data
            const formData = new FormData(contactForm);
            const contactData = {
                name: `${formData.get('first-name')} ${formData.get('last-name')}`,
                email: formData.get('email'),
                phone: formData.get('phone'),
                city: formData.get('city'),
                province: formData.get('province'),
                notes: formData.get('notes'),
                moneyPersonality: formData.get('money-personality')
            };
            
            // Track contact form submission
            if (window.amplitude) {
                window.amplitude.track('Contact Form Submitted', contactData);
            }
            
            if (window.trackGA4Event) {
                window.trackGA4Event('contact_form_submitted', {
                    has_phone: !!contactData.phone,
                    has_notes: !!contactData.notes,
                    money_personality: contactData.moneyPersonality
                });
            }
            
            setTimeout(() => {
                contactForm.classList.add('hidden');
                contactSuccessMessage.classList.remove('hidden');
            }, 2000);
        });
    }

    // --- QUIZ MODAL FUNCTIONALITY ---
    const quizModal = document.getElementById('quiz-modal');
    if (quizModal) {
        const openQuizBtns = document.querySelectorAll('.js-open-quiz-modal');
        const closeQuizBtn = document.getElementById('close-quiz-btn');
        const startScreen = document.getElementById('quiz-start-screen');
        const questionScreen = document.getElementById('quiz-question-screen');
        const resultsScreen = document.getElementById('quiz-results-screen');
        const startQuizBtn = document.getElementById('start-quiz-btn');
        const progressBar = document.getElementById('quiz-progress-bar');
        const questionText = document.getElementById('quiz-question-text');
        const answersGrid = document.getElementById('quiz-answers-grid');
        const resultTitle = document.getElementById('result-title');
        const resultDescription = document.getElementById('result-description');
        const resultDetails = document.getElementById('result-details');

        let currentQuestionIndex = 0;
        let userAnswers = {};

        const openQuizModal = () => {
            quizModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Track quiz opening
            sessionStorage.setItem('seen-quiz', 'true');
            
            if (window.amplitude) {
                window.amplitude.track('Quiz Modal Opened', { 
                    page: window.location.pathname 
                });
            }
            
            if (window.trackGA4Event) {
                window.trackGA4Event('quiz_modal_opened', {
                    page_path: window.location.pathname
                });
            }
        };

        const closeQuizModal = () => {
            quizModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            resetQuiz();
        };

        const startQuiz = () => {
            startScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            
            // Reset quiz state
            currentQuestionIndex = 0;
            userAnswers = {
                'The Legacy Circle': 0,
                'The Horizon Circle': 0,
                'The Blueprint Circle': 0,
                'The Heartwood Circle': 0,
                'The Catalyst Circle': 0,
                'The Sanctuary Circle': 0,
                'The Summit Circle': 0
            };
            
            displayQuestion();
            
            // Track quiz start
            if (window.amplitude) {
                window.amplitude.track('Quiz Started', { 
                    quiz_type: 'money_personality' 
                });
            }
            
            if (window.trackGA4Event) {
                window.trackGA4Event('quiz_started', {
                    quiz_type: 'money_personality'
                });
            }
        };

        const displayQuestion = () => {
            const question = quizQuestions[currentQuestionIndex];
            if (!question) {
                showResults();
                return;
            }

            questionText.textContent = question.question;
            answersGrid.innerHTML = '';

            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-answer-btn';
                button.textContent = answer.text;
                button.addEventListener('click', () => handleAnswer(answer.points));
                answersGrid.appendChild(button);
            });

            // Update progress
            const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
            progressBar.style.width = `${progress}%`;
        };

        const handleAnswer = (points) => {
            // Add points to user answers
            Object.keys(points).forEach(circle => {
                userAnswers[circle] += points[circle];
            });

            // Add transition effect
            questionScreen.style.opacity = '0';

            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion();
                questionScreen.style.opacity = '1';
            }, 300);
        };

        const showResults = () => {
            questionScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');

            const resultKey = Object.keys(userAnswers).reduce((a, b) => userAnswers[a] > userAnswers[b] ? a : b);
            const result = quizResultsData[resultKey];

            resultTitle.textContent = result.title;
            resultDescription.textContent = result.description;
            
            resultDetails.innerHTML = `
                <p><strong>Your Circle:</strong> ${result.circle}</p>
                <p><strong>Your Strengths:</strong> ${result.strengths}</p>
                <p><strong>Area for Growth:</strong> ${result.growth}</p>
            `;
            
            // Store result for application form
            localStorage.setItem('quizResult', result.title);
            localStorage.setItem('moneyPersonality', result.circle);
            
            // Update the CTA button to pass the result to the application form
            const quizCTA = resultsScreen.querySelector('.quiz-cta a');
            if (quizCTA) {
                quizCTA.href = `apply.html?circle=${encodeURIComponent(result.title)}`;
                quizCTA.textContent = 'Apply to Join Your Circle';
            }
            
            // Track quiz completion with both analytics
            if (window.amplitude) {
                window.amplitude.track('Quiz Completed', { 
                    quiz_type: 'money_personality',
                    result: result.title 
                });
            }
            
            if (window.trackGA4Event) {
                window.trackGA4Event('quiz_completed', {
                    quiz_type: 'money_personality',
                    result: result.title
                });
            }
        };

        const resetQuiz = () => {
            startScreen.classList.remove('hidden');
            questionScreen.classList.add('hidden');
            questionScreen.style.opacity = '0';
            resultsScreen.classList.add('hidden');
            progressBar.style.width = '0%';
        };

        openQuizBtns.forEach(btn => btn.addEventListener('click', openQuizModal));
        closeQuizBtn.addEventListener('click', closeQuizModal);
        startQuizBtn.addEventListener('click', startQuiz);
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) closeQuizModal();
        });
    }

    // --- FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpened = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').classList.remove('open');
                }
            });

            // Toggle the clicked item
            if (isOpened) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('open');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });

    // --- FADE-IN ANIMATIONS ON SCROLL ---
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        fadeInElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- RAINBOW VALUE SYSTEM INTERACTIVITY ---
    const rainbowSystem = document.getElementById('rainbow-value-system');
    if (rainbowSystem) {
        const colorItems = rainbowSystem.querySelectorAll('.color-item');
        const detailsContainer = document.getElementById('rainbow-details-content');

        const detailsData = {
            survival: {
                title: 'Survival',
                question: '"Am I safe and supported?"',
                description: 'This bucket covers your essential needs—housing, groceries, utilities—with calm, clarity, and no guilt. It is the foundation upon which your entire financial house is built.',
                ctaText: 'Explore Survival Strategies',
                colorVar: 'var(--color-red)'
            },
            lifestyle: {
                title: 'Lifestyle',
                question: '"What brings me daily joy?"',
                description: 'This is for your day-to-day comforts and joys. It includes hobbies, takeout, and the small indulgences that light up your regular life and make it feel sustainable.',
                ctaText: 'Design Your Joy Budget',
                colorVar: 'var(--color-orange)'
            },
            dreams: {
                title: 'Dreams',
                question: '"What if my dream was a line item?"',
                description: 'This is where you save for your biggest, most exciting goals. Use it to fund your book, your business, or that trip to Italy—like it truly matters.',
                ctaText: 'Start Your Dream Plan',
                colorVar: 'var(--color-yellow)'
            },
            growth: {
                title: 'Growth',
                question: '"How am I becoming more me?"',
                description: 'This bucket is for investing in your personal and professional development. This includes courses, mentors, books, coaching‚ or any other investment that levels you up.',
                ctaText: 'Invest in Your Growth',
                colorVar: 'var(--color-green)'
            },
            security: {
                title: 'Security',
                question: '"How do I protect my peace?"',
                description: 'This is for building your long-term safety net. It includes your emergency fund, insurance, and other financial safety nets that are the quiet heroes of financial calm.',
                ctaText: 'Secure Your Safety Net',
                colorVar: 'var(--color-blue)'
            },
            education: {
                title: 'Education',
                question: '"How do I keep learning and evolving?"',
                description: 'This is for putting money towards learning and new skills. It can be used for learning a language, attending workshops, or studying parenting or investing.',
                ctaText: 'Explore Learning Investments',
                colorVar: 'var(--color-purple)'
            },
            giving: {
                title: 'Giving Back',
                question: '"Where can I circulate love and impact?"',
                description: 'This bucket is for contributing to causes you care about deeply. You can use it to support a friend, donate, or tip generously—seeing giving as a form of abundance.',
                ctaText: 'Build Your Giving Practice',
                colorVar: 'var(--color-pink)'
            },
            custom: {
                title: 'And More…',
                question: '"What does abundance mean for you?"',
                description: 'This is your life, so you get to create custom buckets for anything that matters to you. This could be Therapy, Kids, Nature, Healing, or anything else.',
                ctaText: 'Create Your Money Palette',
                colorVar: 'var(--color-deep-charcoal)'
            }
        };

        const updateDetails = (color) => {
            const data = detailsData[color];
            if (!data) return;

            const newCard = document.createElement('div');
            newCard.className = 'rainbow-detail-card';
            newCard.dataset.color = color;
            newCard.style.setProperty('--color', data.colorVar);

            newCard.innerHTML = `
                <div class="card-content">
                    <h3>${data.title}</h3>
                    <p class="question">${data.question}</p>
                    <p>${data.description}</p>
                    <a href="apply.html" class="button">${data.ctaText}</a>
                </div>
            `;

            const currentCard = detailsContainer.querySelector('.rainbow-detail-card');
            
            currentCard.classList.remove('active');
            newCard.classList.add('active');
            
            detailsContainer.replaceChild(newCard, currentCard);
        };

        colorItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const color = item.dataset.color;
                if (color) {
                    updateDetails(color);
                }
            });
        });
    }

    // --- ADDITIONAL EXISTING FUNCTIONALITY ---
    // Add any other existing functionality here...
    
    // Initialize mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        const toggleMenu = () => {
            const nav = document.querySelector('.main-nav');
            nav.classList.toggle('active');
            
            // Update hamburger icon
            mobileMenuToggle.classList.toggle('active');
            
            // Track mobile menu usage
            if (window.amplitude) {
                window.amplitude.track('Mobile Menu Toggled', {
                    page: window.location.pathname
                });
            }
            
            if (window.trackGA4Event) {
                window.trackGA4Event('mobile_menu_toggled', {
                    page_path: window.location.pathname
                });
            }
        };

        mobileMenuToggle.addEventListener('click', toggleMenu);
    }

    // --- FORM STEPS FUNCTIONALITY ---
    const formSteps = document.querySelectorAll('.form-step');
    if (formSteps.length > 0) {
        let currentStep = 0;
        const totalSteps = formSteps.length;

        const updateFormSteps = () => {
            formSteps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
        };

        const updateProgressBar = () => {
            const progressBar = document.querySelector('.form-progress-bar');
            if (progressBar) {
                const progress = ((currentStep + 1) / totalSteps) * 100;
                progressBar.style.width = `${progress}%`;
            }
        };

        const nextStepBtns = document.querySelectorAll('.next-step');
        const prevStepBtns = document.querySelectorAll('.prev-step');

        nextStepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep < totalSteps - 1) {
                    currentStep++;
                    updateFormSteps();
                    updateProgressBar();
                }
            });
        });

        prevStepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateFormSteps();
                    updateProgressBar();
                }
            });
        });

        const updateButtons = () => {
            // Update button states based on current step
        };

        const goToStep = (step) => {
            currentStep = step;
            updateFormSteps();
            updateProgressBar();
        };

        // Initialize
        updateFormSteps();
        updateProgressBar();
    }
});

// --- QUIZ DATA ---
const quizQuestions = [
    {
        question: "When it comes to money, what's most important to you?",
        answers: [
            { text: "Building something lasting for future generations", points: { "The Legacy Circle": 3, "The Blueprint Circle": 1 } },
            { text: "Having freedom to do what I want, when I want", points: { "The Horizon Circle": 3, "The Sanctuary Circle": 1 } },
            { text: "Creating systems that work efficiently", points: { "The Blueprint Circle": 3, "The Summit Circle": 1 } },
            { text: "Taking care of others and making a difference", points: { "The Heartwood Circle": 3, "The Legacy Circle": 1 } },
            { text: "Building something new and exciting", points: { "The Catalyst Circle": 3, "The Horizon Circle": 1 } },
            { text: "Feeling secure and at peace", points: { "The Sanctuary Circle": 3, "The Legacy Circle": 1 } },
            { text: "Achieving my goals and reaching new heights", points: { "The Summit Circle": 3, "The Catalyst Circle": 1 } }
        ]
    },
    {
        question: "How do you prefer to make financial decisions?",
        answers: [
            { text: "With careful planning and family input", points: { "The Legacy Circle": 3, "The Heartwood Circle": 1 } },
            { text: "Quickly, based on what feels right", points: { "The Horizon Circle": 3, "The Catalyst Circle": 1 } },
            { text: "With detailed analysis and research", points: { "The Blueprint Circle": 3, "The Summit Circle": 1 } },
            { text: "By considering how it affects others", points: { "The Heartwood Circle": 3, "The Sanctuary Circle": 1 } },
            { text: "By weighing risks and potential rewards", points: { "The Catalyst Circle": 3, "The Summit Circle": 1 } },
            { text: "With plenty of time to think it through", points: { "The Sanctuary Circle": 3, "The Legacy Circle": 1 } },
            { text: "By setting clear goals and metrics", points: { "The Summit Circle": 3, "The Blueprint Circle": 1 } }
        ]
    },
    {
        question: "What's your biggest financial fear?",
        answers: [
            { text: "Not leaving enough for my family", points: { "The Legacy Circle": 3, "The Heartwood Circle": 1 } },
            { text: "Being tied down by financial obligations", points: { "The Horizon Circle": 3, "The Catalyst Circle": 1 } },
            { text: "Making a mistake due to lack of planning", points: { "The Blueprint Circle": 3, "The Sanctuary Circle": 1 } },
            { text: "Not being able to help others when they need it", points: { "The Heartwood Circle": 3, "The Legacy Circle": 1 } },
            { text: "Missing out on a great opportunity", points: { "The Catalyst Circle": 3, "The Summit Circle": 1 } },
            { text: "Financial stress affecting my peace of mind", points: { "The Sanctuary Circle": 3, "The Heartwood Circle": 1 } },
            { text: "Not achieving my financial goals", points: { "The Summit Circle": 3, "The Blueprint Circle": 1 } }
        ]
    },
    {
        question: "How do you view debt?",
        answers: [
            { text: "Something to avoid to protect family stability", points: { "The Legacy Circle": 3, "The Sanctuary Circle": 1 } },
            { text: "A tool that shouldn't limit my experiences", points: { "The Horizon Circle": 3, "The Catalyst Circle": 1 } },
            { text: "Something that requires careful management", points: { "The Blueprint Circle": 3, "The Summit Circle": 1 } },
            { text: "Stressful, especially if it affects my ability to help others", points: { "The Heartwood Circle": 3, "The Sanctuary Circle": 1 } },
            { text: "Worth it if it helps me build something valuable", points: { "The Catalyst Circle": 3, "The Blueprint Circle": 1 } },
            { text: "Something that keeps me up at night", points: { "The Sanctuary Circle": 3, "The Legacy Circle": 1 } },
            { text: "A strategic tool for achieving bigger goals", points: { "The Summit Circle": 3, "The Catalyst Circle": 1 } }
        ]
    },
    {
        question: "What motivates you most about building wealth?",
        answers: [
            { text: "Creating a legacy that lasts beyond me", points: { "The Legacy Circle": 3, "The Heartwood Circle": 1 } },
            { text: "Having the freedom to live life on my terms", points: { "The Horizon Circle": 3, "The Sanctuary Circle": 1 } },
            { text: "The satisfaction of a well-executed plan", points: { "The Blueprint Circle": 3, "The Summit Circle": 1 } },
            { text: "Being able to support causes I care about", points: { "The Heartwood Circle": 3, "The Legacy Circle": 1 } },
            { text: "Funding my next big idea or venture", points: { "The Catalyst Circle": 3, "The Horizon Circle": 1 } },
            { text: "The peace of mind that comes with security", points: { "The Sanctuary Circle": 3, "The Blueprint Circle": 1 } },
            { text: "The thrill of reaching new financial milestones", points: { "The Summit Circle": 3, "The Catalyst Circle": 1 } }
        ]
    }
];

const quizResultsData = {
    "The Legacy Circle": {
        title: "The Legacy Circle",
        circle: "Secure Planner",
        description: "You're driven by the desire to create lasting security and build something meaningful for future generations.",
        strengths: "Long-term thinking, family focus, stability-minded",
        growth: "Balancing security with growth opportunities"
    },
    "The Horizon Circle": {
        title: "The Horizon Circle",
        circle: "Free Spirit",
        description: "You value freedom and flexibility, wanting your money to enable experiences and adventures.",
        strengths: "Adaptable, experiential, spontaneous",
        growth: "Creating structure while maintaining flexibility"
    },
    "The Blueprint Circle": {
        title: "The Blueprint Circle",
        circle: "Strategist",
        description: "You love systems, planning, and having detailed strategies for your financial future.",
        strengths: "Analytical, organized, detail-oriented",
        growth: "Balancing planning with adaptability"
    },
    "The Heartwood Circle": {
        title: "The Heartwood Circle",
        circle: "Nurturer",
        description: "You're motivated by taking care of others and making a positive impact with your resources.",
        strengths: "Generous, caring, values-driven",
        growth: "Balancing giving with personal financial health"
    },
    "The Catalyst Circle": {
        title: "The Catalyst Circle",
        circle: "Creator",
        description: "You're an innovator and risk-taker, excited about using money to build and create new things.",
        strengths: "Innovative, entrepreneurial, opportunity-focused",
        growth: "Managing risk while pursuing opportunities"
    },
    "The Sanctuary Circle": {
        title: "The Sanctuary Circle",
        circle: "Peacekeeper",
        description: "You prioritize peace of mind and emotional well-being in your financial decisions.",
        strengths: "Thoughtful, patient, security-focused",
        growth: "Building confidence for bigger financial moves"
    },
    "The Summit Circle": {
        title: "The Summit Circle",
        circle: "Achiever",
        description: "You're goal-oriented and motivated by reaching new heights in your financial journey.",
        strengths: "Ambitious, goal-oriented, performance-driven",
        growth: "Balancing achievement with well-being"
    }
};

