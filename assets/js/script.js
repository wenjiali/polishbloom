document.addEventListener('DOMContentLoaded', () => {
    // --- MINI-PLAN MODAL LOGIC (runs on Rainbow Cashflow page) ---
    const miniPlanModal = document.getElementById('mini-plan-modal');
    if (miniPlanModal) {
        const colorItems = document.querySelectorAll('.color-item[data-color]');
        const closeMiniPlanBtn = document.getElementById('close-mini-plan-btn');
        const miniPlanTitle = document.getElementById('mini-plan-title');
        const miniPlanQuestion = document.getElementById('mini-plan-question');
        const miniPlanDescription = document.getElementById('mini-plan-description');
        const miniPlanCtaBtn = document.getElementById('mini-plan-cta-btn');

        const miniPlanData = {
            survival: {
                title: 'Survival: Essentials Reset',
                question: '“Am I safe and supported?”',
                description: 'This worksheet helps you build a monthly Essential Confidence Plan. It focuses on covering your core needs—housing, groceries, utilities—with calm, clarity, and no guilt.',
                ctaText: 'Try the "Essentials Reset" worksheet',
                ctaLink: '#' // This should link to the form at the bottom of the page.
            },
            lifestyle: {
                title: 'Lifestyle: Design Your Joy Budget',
                question: "What brings me daily joy?",
                description: 'Use the Lifestyle Flow Tracker to balance joy and responsibility without burnout. It helps you make intentional space for hobbies, takeout, and the small indulgences that light up your life.',
                ctaText: 'Design Your Joy Budget',
                ctaLink: '#'
            },
            dreams: {
                title: 'Dreams: Start Your Dream Plan',
                question: "What if my dream was a line item?",
                description: 'The Dream Fund Map turns your biggest goals into actionable micro-moves. Visualize your progress and save for your book, your business, or that trip to Italy—like it truly matters.',
                ctaText: 'Start Your Dream Plan',
                ctaLink: '#'
            },
            growth: {
                title: 'Growth: Grow with Purpose',
                question: "How am I becoming more me?",
                description: 'The Growth Budget Builder helps you plan annual investments in yourself, from courses and mentors to books and coaching, without any guilt.',
                ctaText: 'Grow with Purpose',
                ctaLink: '#'
            },
            security: {
                title: 'Security: Secure Your Safety Net',
                question: "How do I protect my peace?",
                description: 'The Financial Safety Toolkit provides checklists and prompts to build your emergency fund, insurance, and other financial safety nets with a sense of calm, not fear.',
                ctaText: 'Secure Your Safety Net',
                ctaLink: '#'
            },
            education: {
                title: 'Education: Explore Learning Investments',
                question: "How do I keep learning and evolving?",
                description: 'Discover curated learning paths to spend smarter on courses, workshops, and other educational pursuits that align with your future self.',
                ctaText: 'Explore Learning Investments',
                ctaLink: '#'
            },
            giving: {
                title: 'Giving: Build Your Giving Practice',
                question: "Where can I circulate love and impact?",
                description: 'The Giving Ritual Plan helps you reflect on causes you care about, making the act of supporting friends, donating, or tipping an intentional and joyful form of abundance.',
                ctaText: 'Build Your Giving Practice',
                ctaLink: '#'
            },
            custom: {
                title: 'And More… Create Your Money Palette',
                question: "What does abundance mean for you?",
                description: 'This visual worksheet helps you define what matters most to you. This is your life, so create custom buckets for anything from Therapy and Kids to Nature and Healing.',
                ctaText: 'Create Your Money Palette',
                ctaLink: '#'
            }
        };

        function openMiniPlanModal(color, colorValue) {
            const data = miniPlanData[color];
            if (!data) return;

            miniPlanTitle.textContent = data.title;
            miniPlanTitle.style.borderColor = colorValue;
            miniPlanQuestion.textContent = data.question;
            miniPlanDescription.textContent = data.description;
            miniPlanCtaBtn.textContent = data.ctaText;
            miniPlanCtaBtn.href = data.ctaLink;
            // When CTAs open the contact form, we'll add this logic back in
            // miniPlanCtaBtn.classList.add('js-open-contact-modal');
            // miniPlanCtaBtn.dataset.title = `Inquire about ${data.title}`;
            
            miniPlanCtaBtn.style.backgroundColor = colorValue;
            miniPlanCtaBtn.style.borderColor = colorValue;


            miniPlanModal.classList.remove('hidden');
        }

        function closeMiniPlanModal() {
            miniPlanModal.classList.add('hidden');
        }

        colorItems.forEach(item => {
            item.addEventListener('click', () => {
                const color = item.dataset.color;
                const colorValue = getComputedStyle(item).getPropertyValue('--color');
                openMiniPlanModal(color, colorValue);
            });
            // Make card clickable
            item.style.cursor = 'pointer';
        });

        closeMiniPlanBtn.addEventListener('click', closeMiniPlanModal);
        miniPlanModal.addEventListener('click', (e) => {
            if (e.target === miniPlanModal) {
                closeMiniPlanModal();
            }
        });
    }

    // --- DELAYED REDIRECT FOR RAINBOW CASHFLOW PAGE ---
    const valueShowcase = document.querySelector('.color-system-grid');
    if (valueShowcase) {
        valueShowcase.addEventListener('click', function(e) {
            const button = e.target.closest('.button');
            if (button && button.href.includes('join.html')) {
                e.preventDefault(); 

                const allItems = valueShowcase.querySelectorAll('.color-item');
                allItems.forEach(item => item.classList.remove('selected'));

                const card = e.target.closest('.color-item');
                if (card) {
                    card.classList.add('selected');
                }

                button.textContent = 'Redirecting...';

                setTimeout(() => {
                    window.location.href = button.href;
                }, 1500);
            }
        });
    }

    // --- CONTACT MODAL LOGIC (runs on all pages with the modal) ---
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        const openContactModalBtns = document.querySelectorAll('.js-open-contact-modal');
        const closeContactBtn = document.getElementById('close-contact-btn');
        const contactForm = document.getElementById('contact-form');
        const formSuccessMessage = document.getElementById('form-success-message');
        const contactModalTitle = document.getElementById('contact-modal-title');

        const openContactModal = (title = 'Get in Touch') => {
            contactModalTitle.textContent = title;
            contactModal.classList.remove('hidden');
        };

        const closeContactModal = () => {
            contactModal.classList.add('hidden');
            setTimeout(() => {
                contactForm.style.display = 'block';
                formSuccessMessage.style.display = 'none';
                contactForm.reset();
            }, 300);
        };

        openContactModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = e.currentTarget.dataset.title;
                openContactModal(title);
            });
        });

        closeContactBtn.addEventListener('click', closeContactModal);
        contactModal.addEventListener('click', e => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });

        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            contactForm.style.display = 'none';
            formSuccessMessage.style.display = 'block';
        });
    }

    // --- QUIZ LOGIC (runs on any page with the modal) ---
    const quizModal = document.getElementById('quiz-modal');
    if (quizModal) {
        const openQuizBtns = document.querySelectorAll('.js-open-quiz-modal');
        const closeQuizBtn = document.getElementById('close-quiz-btn');
        const startQuizBtn = document.getElementById('start-quiz-btn');
        
        const startScreen = document.getElementById('quiz-start-screen');
        const questionScreen = document.getElementById('quiz-question-screen');
        const resultsScreen = document.getElementById('quiz-results-screen');
        
        const progressBar = document.getElementById('quiz-progress-bar');
        const questionText = document.getElementById('quiz-question-text');
        const answersGrid = document.getElementById('quiz-answers-grid');
        
        const resultTitle = document.getElementById('result-title');
        const resultDescription = document.getElementById('result-description');
        const resultDetails = document.getElementById('result-details');

        const quizQuestions = [
            { question: "When you receive an unexpected financial windfall, your first instinct is to:", answers: { a: "Save or invest it for long-term security.", b: "Plan a memorable trip or experience.", c: "Create a detailed spreadsheet to allocate every dollar.", d: "Use it to help a friend or a cause you care about.", e: "Invest it in a creative project or business idea.", f: "Put it aside to decide later, avoiding any hasty decisions.", g: "Use it to get ahead on a major life goal (like a home or career change)." } },
            { question: "Your ideal relationship with money is one of:", answers: { a: "Safety & predictability", b: "Freedom & spontaneity", c: "Organization & efficiency", d: "Connection & generosity", e: "Innovation & opportunity", f: "Peace & mindfulness", g: "Achievement & impact" } },
            { question: "When making a large purchase, you are most likely to:", answers: { a: "Research exhaustively to ensure it's a sound, future-proof choice.", b: "Focus on how it will enhance your life experiences.", c: "Compare prices and features methodically to get the best value.", d: "Consider its impact on your loved ones or community.", e: "Choose the option that feels the most exciting or has the biggest potential.", f: "Wait until you feel completely calm and certain about the decision.", g: "Choose the option that best aligns with your long-term ambitions." } },
            { question: "A 'rich life' means:", answers: { a: "Never having to worry about money.", b: "The freedom to do what you want, when you want.", c: "Having a clear system that works for you.", d: "Being able to support the people and causes you love.", e: "Building something of your own from the ground up.", f: "Feeling content and at ease, regardless of your bank balance.", g: "Making a significant impact and leaving a legacy." } },
            { question: "What financial topic do you wish you knew more about?", answers: { a: "Long-term investing and estate planning.", b: "Travel hacking or funding a sabbatical.", c: "Budgeting software and automation.", d: "Ethical investing or charitable giving strategies.", e: "Angel investing or funding a creative project.", f: "Mindful spending and financial minimalism.", g: "Salary negotiation and scaling your income." } },
            { question: "You feel most successful when:", answers: { a: "Your emergency fund is fully funded.", b: "You book a spontaneous flight just because.", c: "Your budget reconciles perfectly to the cent.", d: "You can treat your loved ones without a second thought.", e: "A risky idea pays off.", f: "You make a financial decision that feels truly peaceful.", g: "You hit an ambitious income or savings target." } },
            { question: "Your biggest financial fear is:", answers: { a: "An unexpected crisis wiping out your savings.", b: "Missing out on life's great adventures due to a lack of funds.", c: "Losing track of details and feeling financially chaotic.", d: "Not being able to help someone you care about.", e: "A brilliant idea failing due to a lack of capital.", f: "Feeling stressed or overwhelmed by money matters.", g: "Not reaching your full potential financially." } }
        ];

        const quizResultsData = {
            a: { title: "The Secure Planner", description: "You value stability and security. You plan carefully and prefer long-term financial safety nets.", strengths: "Thoughtful, disciplined, cautious.", growth: "Avoid over-worrying, embrace some flexibility.", circle: "The Legacy Circle" },
            b: { title: "The Free Spirit", description: "You see money as a tool for freedom and adventure. You're spontaneous and optimistic.", strengths: "Intuitive, generous, adventurous.", growth: "Create simple savings goals, track spending lightly.", circle: "The Horizon Circle" },
            c: { title: "The Strategist", description: "You feel empowered by having a clear plan. You're organized, logical, and love to be in control of the details.", strengths: "Detail-oriented, efficient, goal-driven.", growth: "Allow for spontaneity, celebrate progress not just perfection.", circle: "The Blueprint Circle" },
            d: { title: "The Nurturer", description: "You are driven by generosity and community. You find joy in supporting others and using money to care for loved ones.", strengths: "Empathetic, caring, community-focused.", growth: "Set boundaries, prioritize your own financial self-care.", circle: "The Heartwood Circle" },
            e: { title: "The Creator", description: "You are an innovator who sees money as a tool for creative expression and opportunity. You're not afraid to take risks on new ideas.", strengths: "Entrepreneurial, inventive, resourceful.", growth: "Balance new ventures with stable income streams.", circle: "The Catalyst Circle" },
            f: { title: "The Peacekeeper", description: "You seek calm and balance in your financial life, avoiding stress and conflict. You prefer a mindful, intuitive approach.", strengths: "Calm, mindful, balanced.", growth: "Engage in necessary financial conversations, set clear goals.", circle: "The Sanctuary Circle" },
            g: { title: "The Achiever", description: "You are ambitious and motivated by success. You see money as a measure of growth and a tool to achieve big goals.", strengths: "Driven, confident, goal-oriented.", growth: "Balance ambition with rest, celebrate non-financial wins.", circle: "The Summit Circle" }
        };

        let currentQuestionIndex = 0;
        let userAnswers = {};

        const openQuizModal = () => {
            quizModal.classList.remove('hidden');
            resetQuiz(); 
        };

        const closeQuizModal = () => {
            quizModal.classList.add('hidden');
        };

        const startQuiz = () => {
            startScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            resultsScreen.classList.add('hidden');
            currentQuestionIndex = 0;
            userAnswers = {};
            displayQuestion();
        };

        const displayQuestion = () => {
            if (currentQuestionIndex < quizQuestions.length) {
                const progressPercentage = ((currentQuestionIndex) / quizQuestions.length) * 100;
                progressBar.style.width = `${progressPercentage}%`;
                
                const currentQ = quizQuestions[currentQuestionIndex];
                questionText.textContent = currentQ.question;
                answersGrid.innerHTML = '';
                
                for (const key in currentQ.answers) {
                    const button = document.createElement('button');
                    button.className = 'quiz-answer-button';
                    button.textContent = currentQ.answers[key];
                    button.dataset.answer = key;
                    button.addEventListener('click', handleAnswer);
                    answersGrid.appendChild(button);
                }
            } else {
                showResults();
            }
        };

        const handleAnswer = (e) => {
            const selectedAnswer = e.currentTarget.dataset.answer;
            userAnswers[selectedAnswer] = (userAnswers[selectedAnswer] || 0) + 1;
            currentQuestionIndex++;
            displayQuestion();
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
            
            // Optional: Store result for other pages
            localStorage.setItem('moneyPersonality', result.circle);
        };

        const resetQuiz = () => {
            startScreen.classList.remove('hidden');
            questionScreen.classList.add('hidden');
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
                question: '“Am I safe and supported?”',
                description: 'This bucket covers your essential needs—housing, groceries, utilities—with calm, clarity, and no guilt. It is the foundation upon which your entire financial house is built.',
                ctaText: 'Explore Survival Strategies',
                colorVar: 'var(--color-red)'
            },
            lifestyle: {
                title: 'Lifestyle',
                question: '“What brings me daily joy?”',
                description: 'This is for your day-to-day comforts and joys. It includes hobbies, takeout, and the small indulgences that light up your regular life and make it feel sustainable.',
                ctaText: 'Design Your Joy Budget',
                colorVar: 'var(--color-orange)'
            },
            dreams: {
                title: 'Dreams',
                question: '“What if my dream was a line item?”',
                description: 'This is where you save for your biggest, most exciting goals. Use it to fund your book, your business, or that trip to Italy—like it truly matters.',
                ctaText: 'Start Your Dream Plan',
                colorVar: 'var(--color-yellow)'
            },
            growth: {
                title: 'Growth',
                question: '“How am I becoming more me?”',
                description: 'This bucket is for investing in your personal and professional development. This includes courses, mentors, books, coaching‚ or any other investment that levels you up.',
                ctaText: 'Invest in Your Growth',
                colorVar: 'var(--color-green)'
            },
            security: {
                title: 'Security',
                question: '“How do I protect my peace?”',
                description: 'This is for building your long-term safety net. It includes your emergency fund, insurance, and other financial safety nets that are the quiet heroes of financial calm.',
                ctaText: 'Secure Your Safety Net',
                colorVar: 'var(--color-blue)'
            },
            education: {
                title: 'Education',
                question: '“How do I keep learning and evolving?”',
                description: 'This is for putting money towards learning and new skills. It can be used for learning a language, attending workshops, or studying parenting or investing.',
                ctaText: 'Explore Learning Investments',
                colorVar: 'var(--color-purple)'
            },
            giving: {
                title: 'Giving Back',
                question: '“Where can I circulate love and impact?”',
                description: 'This bucket is for contributing to causes you care about deeply. You can use it to support a friend, donate, or tip generously—seeing giving as a form of abundance.',
                ctaText: 'Build Your Giving Practice',
                colorVar: 'var(--color-pink)'
            },
            custom: {
                title: 'And More…',
                question: '“What does abundance mean for you?”',
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
                    <a href="join.html" class="button">${data.ctaText}</a>
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
                
                colorItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                updateDetails(color);
            });
        });
    }

    // --- MOBILE NAVIGATION ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavScrim = document.getElementById('mobile-nav-scrim');

    if (hamburgerBtn && mobileNav && mobileNavScrim) {
        const toggleMenu = () => {
            const isOpened = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            document.body.classList.toggle('mobile-nav-open');
            hamburgerBtn.setAttribute('aria-expanded', !isOpened);
            mobileNavScrim.classList.toggle('hidden');
        };

        hamburgerBtn.addEventListener('click', toggleMenu);
        mobileNavScrim.addEventListener('click', toggleMenu);
    }
})();
