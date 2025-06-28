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
    const openContactModalBtns = document.querySelectorAll('.js-open-contact-modal');

    if (contactModal && openContactModalBtns.length > 0) {
        const contactModalTitle = document.getElementById('contact-modal-title');
        const closeContactBtn = document.getElementById('close-contact-btn');
        const contactForm = document.getElementById('contact-form');
        const formSuccessMessage = document.getElementById('form-success-message');

        function openContactModal(title, circle) {
            contactModalTitle.textContent = title;
            const moneyPersonalityDropdown = document.getElementById('money-personality');

            // Pre-fill dropdown if circle is passed and dropdown exists
            if (circle && moneyPersonalityDropdown) {
                moneyPersonalityDropdown.value = circle;
            } else if (moneyPersonalityDropdown) {
                // Otherwise, use value from localStorage (from quiz) or clear it
                const personality = localStorage.getItem('moneyPersonality');
                if (personality) {
                    // This logic might need adjustment if personality title differs from dropdown value
                    // For now, we find the option whose text includes the personality title
                    let matchingOption = Array.from(moneyPersonalityDropdown.options).find(opt => opt.text.includes(personality));
                    if (matchingOption) {
                        moneyPersonalityDropdown.value = matchingOption.value;
                    }
                }
            }
            contactModal.classList.remove('hidden');
        }

        function closeContactModal() {
            contactModal.classList.add('hidden');
            setTimeout(() => {
                contactForm.classList.remove('hidden');
                formSuccessMessage.classList.add('hidden');
                contactForm.reset();
                const moneyPersonalityDropdown = document.getElementById('money-personality');
                 if (moneyPersonalityDropdown) {
                    moneyPersonalityDropdown.value = ""; // Reset dropdown
                }
            }, 300); // Wait for transition
        }

        function handleOpenContactModal(e) {
            e.preventDefault();
            const title = e.currentTarget.dataset.title || 'Get In Touch';
            const circle = e.currentTarget.dataset.circle || null;
            openContactModal(title, circle);
        }

        function handleContactFormSubmit(e) {
            e.preventDefault();
            contactForm.classList.add('hidden');
            formSuccessMessage.classList.remove('hidden');
        }

        openContactModalBtns.forEach(button => {
            button.addEventListener('click', handleOpenContactModal);
        });

        closeContactBtn.addEventListener('click', closeContactModal);
        contactForm.addEventListener('submit', handleContactFormSubmit);
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }

    // --- QUIZ LOGIC (runs on any page with the modal) ---
    const quizModal = document.getElementById('quiz-modal');
    if (quizModal) {
        const startQuizBtns = document.querySelectorAll('.js-start-quiz-btn');
        const closeQuizBtn = document.getElementById('close-quiz-btn');
        const beginQuizBtn = document.getElementById('begin-quiz-btn');
        const startScreen = document.getElementById('quiz-start-screen');
        const questionScreen = document.getElementById('quiz-question-screen');
        const resultsScreen = document.getElementById('quiz-results-screen');
        const quizProgress = document.getElementById('quiz-progress');
        const questionText = document.getElementById('quiz-question-text');
        const answersGrid = document.getElementById('quiz-answers');
        const resultDisplay = document.getElementById('quiz-result-display');
        const seeAllProgramsBtn = document.getElementById('see-all-programs-btn');

        const quizQuestions = [
            { question: "When you think about money, what feeling comes up most often?", answers: { a: "Security and stability", b: "Freedom and adventure", c: "Control and planning", d: "Generosity and sharing", e: "Creativity and flexibility", f: "Calm and balance", g: "Ambition and growth" } },
            { question: "How do you usually make financial decisions?", answers: { a: "Careful research and long-term thinking", b: "Following your intuition and gut feelings", c: "Creating detailed budgets and plans", d: "Consulting with trusted friends or family", e: "Experimenting with new ideas and approaches", f: "Going with the flow and staying mindful", g: "Setting big goals and chasing opportunities" } },
            { question: "What motivates you most about managing money?", answers: { a: "Building a safe future", b: "Experiencing life fully", c: "Having complete control", d: "Supporting others and community", e: "Expressing yourself uniquely", f: "Maintaining peace of mind", g: "Achieving success and influence" } },
            { question: "What's your biggest challenge with money?", answers: { a: "Worrying about unexpected expenses", b: "Staying committed to savings", c: "Keeping track of every detail", d: "Saying no to requests for help", e: "Finding the right balance between risk and fun", f: "Avoiding financial stress", g: "Feeling overwhelmed by opportunities" } },
            { question: "How does money affect your relationships?", answers: { a: "I prioritize financial security for them.", b: "I want to share joyful experiences without stress.", c: "I prefer clear money roles and plans.", d: "I often give or lend money to support them.", e: "I like mixing creativity and fun in shared finances.", f: "I try to keep money talk calm and avoid conflict.", g: "I feel pressure to be a financial role model." } },
            { question: "How do financial conversations typically go?", answers: { a: "We plan carefully and discuss finances openly.", b: "We focus on shared dreams and spontaneous fun.", c: "We set clear budgets and financial goals.", d: "We openly support each other's needs.", e: "We brainstorm new money ideas together.", f: "We avoid stress by keeping discussions light.", g: "We push each other to achieve more financially." } },
            { question: "How does your career relate to your money mindset?", answers: { a: "I seek stability and steady growth.", b: "I want freedom and flexibility in work.", c: "I plan career moves with clear financial goals.", d: "I value work that supports my community.", e: "I pursue creative or entrepreneurial ventures.", f: "I prefer balance and avoid burnout.", g: "I aim for leadership and high earnings." } },
            { question: "How do you practice self-love financially?", answers: { a: "I save and invest for my future security.", b: "I spend on experiences that bring me joy.", c: "I track progress and celebrate milestones.", d: "I use money to care for others and myself.", e: "I try new ways to make money meaningful.", f: "I remind myself to relax about money.", g: "I challenge myself to grow financially." } },
            { question: "When faced with a financial setback, how do you respond?", answers: { a: "I review my plan and adjust carefully.", b: "I look for new opportunities and stay positive.", c: "I double down on budgeting and control.", d: "I seek support from loved ones.", e: "I get creative to find solutions.", f: "I focus on self-care and emotional balance.", g: "I tackle it head-on with determination." } },
            { question: "What role does money play in your happiness?", answers: { a: "It gives me peace of mind and security.", b: "It allows me to explore and enjoy life.", c: "It helps me feel organized and in control.", d: "It empowers me to give and connect.", e: "It fuels my creativity and passions.", f: "It helps me maintain inner calm.", g: "It drives my ambitions and achievements." } }
        ];

        const quizResults = {
                a: { color: "Blue", title: "The Secure Planner", description: "You value stability and security. You plan carefully and prefer long-term financial safety nets.", strengths: "Thoughtful, disciplined, cautious.", growth: "Avoid over-worrying, embrace some flexibility.", circle: "The Legacy Circle", cta: "Join the Legacy Circle to build a lasting financial foundation." },
                b: { color: "Yellow", title: "The Free Spirit", description: "You see money as a tool for freedom and adventure. You're spontaneous and optimistic.", strengths: "Intuitive, generous, adventurous.", growth: "Create simple savings goals, track spending lightly.", circle: "The Horizon Circle", cta: "Join the Horizon Circle to fund your dreams and adventures." },
                c: { color: "Green", title: "The Strategist", description: "You feel empowered by having a clear plan. You're organized, logical, and love to be in control of the details.", strengths: "Detail-oriented, efficient, goal-driven.", growth: "Allow for spontaneity, celebrate progress not just perfection.", circle: "The Blueprint Circle", cta: "Join the Blueprint Circle to master your financial plan." },
                d: { color: "Pink", title: "The Nurturer", description: "You are driven by generosity and community. You find joy in supporting others and using money to care for loved ones.", strengths: "Empathetic, caring, community-focused.", growth: "Set boundaries, prioritize your own financial self-care.", circle: "The Heartwood Circle", cta: "Join the Heartwood Circle to align your money with your heart." },
                e: { color: "Orange", title: "The Creator", description: "You are an innovator who sees money as a tool for creative expression and opportunity. You're not afraid to take risks on new ideas.", strengths: "Entrepreneurial, inventive, resourceful.", growth: "Balance new ventures with stable income streams.", circle: "The Catalyst Circle", cta: "Join the Catalyst Circle to spark your financial creativity." },
                f: { color: "Purple", title: "The Peacekeeper", description: "You seek calm and balance in your financial life, avoiding stress and conflict. You prefer a mindful, intuitive approach.", strengths: "Calm, mindful, balanced.", growth: "Engage in necessary financial conversations, set clear goals.", circle: "The Sanctuary Circle", cta: "Join the Sanctuary Circle to find financial peace of mind." },
                g: { color: "Red", title: "The Achiever", description: "You are ambitious and motivated by success. You see money as a measure of growth and a tool to achieve big goals.", strengths: "Driven, confident, goal-oriented.", growth: "Balance ambition with rest, celebrate non-financial wins.", circle: "The Summit Circle", cta: "Join the Summit Circle to reach your financial peak." }
        };

        let currentQuestionIndex = 0;
        let userAnswers = {};

        function openQuizModal() {
            quizModal.classList.remove('hidden');
            startScreen.classList.remove('hidden');
        }

        function closeQuizModal() { quizModal.classList.add('hidden'); resetQuiz(); }

        function startQuiz() {
            currentQuestionIndex = 0;
            userAnswers = {};
            startScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            displayQuestion();
        }

        function displayQuestion() {
            const question = quizQuestions[currentQuestionIndex];
            quizProgress.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
            questionText.textContent = question.question;
            answersGrid.innerHTML = '';
            for (const key in question.answers) {
                const answerBtn = document.createElement('button');
                answerBtn.className = 'quiz-answer-button';
                answerBtn.textContent = question.answers[key];
                answerBtn.dataset.answer = key;
                answerBtn.addEventListener('click', handleAnswer);
                answersGrid.appendChild(answerBtn);
            }
        }

        function handleAnswer(e) {
            const selectedAnswer = e.target.dataset.answer;
            userAnswers[selectedAnswer] = (userAnswers[selectedAnswer] || 0) + 1;
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                displayQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            questionScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            const resultKey = Object.keys(userAnswers).reduce((a, b) => userAnswers[a] > userAnswers[b] ? a : b);
            const result = quizResults[resultKey];
                localStorage.setItem('moneyPersonality', result.title);
            resultDisplay.innerHTML = `
                <div class="result-badge" style="background-color:var(--color-${result.color.toLowerCase()});"></div>
                <h3 class="result-title">${result.color} — ${result.title}</h3>
                <p class="result-description">${result.description}</p>
                <div class="result-details">
                    <p><strong>Strengths:</strong> ${result.strengths}</p>
                    <p><strong>Growth Areas:</strong> ${result.growth}</p>
                </div>
            `;
                const personalizedCta = document.getElementById('quiz-personalized-cta');
                personalizedCta.innerHTML = `
                    <h4>Your Recommended Bloom Circle</h4>
                    <p>${result.cta}</p>
                    <a href="#" class="button button-primary js-open-contact-modal" data-title="Join ${result.circle}" data-circle="${result.circle}">${result.circle}</a>
                `;
                
                // This is the crucial part: find the new button and add the listener
                const newCtaButton = personalizedCta.querySelector('.js-open-contact-modal');
                if (newCtaButton) {
                    newCtaButton.addEventListener('click', handleOpenContactModal);
                }
        }

        function resetQuiz() {
            resultsScreen.classList.add('hidden');
            questionScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
                localStorage.removeItem('moneyPersonality');
        }

        startQuizBtns.forEach(btn => {
            btn.addEventListener('click', openQuizModal);
        });

        if (closeQuizBtn) {
            closeQuizBtn.addEventListener('click', closeQuizModal);
        }
        if (beginQuizBtn) {
            beginQuizBtn.addEventListener('click', startQuiz);
        }
        if (seeAllProgramsBtn) {
            seeAllProgramsBtn.addEventListener('click', closeQuizModal);
        }
        
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                    closeQuizModal();
            }
        });
    }

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherItem !== item && otherQuestion && otherAnswer) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.classList.remove('open');
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.classList.remove('open');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.classList.add('open');
                }
            });
        }
    });

    // Fade-in animations on scroll
    const fadeInElements = document.querySelectorAll('.fade-in');
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

})();