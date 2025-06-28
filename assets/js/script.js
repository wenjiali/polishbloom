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
        const openQuizBtns = document.querySelectorAll('.js-start-quiz-btn');
        const closeQuizBtn = document.getElementById('close-quiz-btn');
        const startQuizBtnModal = document.getElementById('start-quiz-btn-modal');

        const startScreen = document.getElementById('quiz-start-screen');
        const questionScreen = document.getElementById('quiz-question-screen');
        const resultsScreen = document.getElementById('quiz-results-screen');
        
        const quizProgress = document.getElementById('quiz-progress');
        const questionText = document.getElementById('quiz-question-text');
        const answersGrid = document.querySelector('#quiz-question-screen .quiz-answers-grid');
        const resultDisplay = document.getElementById('quiz-result-content');
        const personalizedCta = document.getElementById('quiz-personalized-cta');

        const quizQuestions = [
            { question: "When you receive an unexpected financial windfall, your first instinct is to:", answers: { a: "Save or invest it for long-term security.", b: "Plan a memorable trip or experience.", c: "Create a detailed spreadsheet to allocate every dollar.", d: "Use it to help a friend or a cause you care about.", e: "Invest it in a creative project or business idea.", f: "Put it aside to decide later, avoiding any hasty decisions.", g: "Use it to get ahead on a major life goal (like a home or career change)." } },
            { question: "Your ideal relationship with money is one of:", answers: { a: "Safety & predictability", b: "Freedom & spontaneity", c: "Organization & efficiency", d: "Connection & generosity", e: "Innovation & opportunity", f: "Peace & mindfulness", g: "Achievement & impact" } },
            { question: "When making a large purchase, you are most likely to:", answers: { a: "Research exhaustively to ensure it's a sound, future-proof choice.", b: "Focus on how it will enhance your life experiences.", c: "Compare prices and features methodically to get the best value.", d: "Consider its impact on your loved ones or community.", e: "Choose the option that feels the most exciting or has the biggest potential.", f: "Wait until you feel completely calm and certain about the decision.", g: "Choose the option that best aligns with your long-term ambitions." } },
            { question: "A 'rich life' means:", answers: { a: "Never having to worry about money.", b: "The freedom to do what you want, when you want.", c: "Having a clear system that works for you.", d: "Being able to support the people and causes you love.", e: "Building something of your own from the ground up.", f: "Feeling content and at ease, regardless of your bank balance.", g: "Making a significant impact and leaving a legacy." } },
            { question: "What financial topic do you wish you knew more about?", answers: { a: "Long-term investing and estate planning.", b: "Travel hacking or funding a sabbatical.", c: "Budgeting software and automation.", d: "Ethical investing or charitable giving strategies.", e: "Angel investing or funding a creative project.", f: "Mindful spending and financial minimalism.", g: "Salary negotiation and scaling your income." } },
            { question: "You feel most successful when:", answers: { a: "Your emergency fund is fully funded.", b: "You book a spontaneous flight just because.", c: "Your budget reconciles perfectly to the cent.", d: "You can treat your loved ones without a second thought.", e: "A risky idea pays off.", f: "You make a financial decision that feels truly peaceful.", g: "You hit an ambitious income or savings target." } },
            { question: "Your biggest financial fear is:", answers: { a: "An unexpected crisis wiping out your savings.", b: "Missing out on life's great adventures due to a lack of funds.", c: "Losing track of details and feeling financially chaotic.", d: "Not being able to help someone you care about.", e: "A brilliant idea failing due to a lack of capital.", f: "Feeling stressed or overwhelmed by money matters.", g: "Not reaching your full potential financially." } }
        ];

        const quizResults = {
                a: { color: "Blue", title: "The Secure Planner", description: "You value stability and security. You plan carefully and prefer long-term financial safety nets.", strengths: "Thoughtful, disciplined, cautious.", growth: "Avoid over-worrying, embrace some flexibility.", circle: "The Legacy Circle", ctaText: "Join the Legacy Circle" },
                b: { color: "Yellow", title: "The Free Spirit", description: "You see money as a tool for freedom and adventure. You're spontaneous and optimistic.", strengths: "Intuitive, generous, adventurous.", growth: "Create simple savings goals, track spending lightly.", circle: "The Horizon Circle", ctaText: "Join the Horizon Circle" },
                c: { color: "Green", title: "The Strategist", description: "You feel empowered by having a clear plan. You're organized, logical, and love to be in control of the details.", strengths: "Detail-oriented, efficient, goal-driven.", growth: "Allow for spontaneity, celebrate progress not just perfection.", circle: "The Blueprint Circle", ctaText: "Join the Blueprint Circle" },
                d: { color: "Pink", title: "The Nurturer", description: "You are driven by generosity and community. You find joy in supporting others and using money to care for loved ones.", strengths: "Empathetic, caring, community-focused.", growth: "Set boundaries, prioritize your own financial self-care.", circle: "The Heartwood Circle", ctaText: "Join the Heartwood Circle" },
                e: { color: "Orange", title: "The Creator", description: "You are an innovator who sees money as a tool for creative expression and opportunity. You're not afraid to take risks on new ideas.", strengths: "Entrepreneurial, inventive, resourceful.", growth: "Balance new ventures with stable income streams.", circle: "The Catalyst Circle", ctaText: "Join the Catalyst Circle" },
                f: { color: "Purple", title: "The Peacekeeper", description: "You seek calm and balance in your financial life, avoiding stress and conflict. You prefer a mindful, intuitive approach.", strengths: "Calm, mindful, balanced.", growth: "Engage in necessary financial conversations, set clear goals.", circle: "The Sanctuary Circle", ctaText: "Join the Sanctuary Circle" },
                g: { color: "Red", title: "The Achiever", description: "You are ambitious and motivated by success. You see money as a measure of growth and a tool to achieve big goals.", strengths: "Driven, confident, goal-oriented.", growth: "Balance ambition with rest, celebrate non-financial wins.", circle: "The Summit Circle", ctaText: "Join the Summit Circle" }
        };

        let currentQuestionIndex = 0;
        let userAnswers = {};

        function openQuizModal() { quizModal.classList.remove('hidden'); }
        function closeQuizModal() { quizModal.classList.add('hidden'); setTimeout(resetQuiz, 300); }

        function startQuiz() {
            startScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            currentQuestionIndex = 0;
            userAnswers = {};
            displayQuestion();
        }

        function displayQuestion() {
            if (currentQuestionIndex < quizQuestions.length) {
                const question = quizQuestions[currentQuestionIndex];
                questionText.textContent = question.question;
                quizProgress.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
                answersGrid.innerHTML = '';
                for (const key in question.answers) {
                    const button = document.createElement('button');
                    button.className = 'quiz-answer-button';
                    button.textContent = question.answers[key];
                    button.dataset.answer = key;
                    button.addEventListener('click', handleAnswer);
                    answersGrid.appendChild(button);
                }
            } else {
                showResults();
            }
        }

        function handleAnswer(e) {
            const selectedAnswer = e.target.dataset.answer;
            userAnswers[selectedAnswer] = (userAnswers[selectedAnswer] || 0) + 1;
            currentQuestionIndex++;
            displayQuestion();
        }

        function showResults() {
            questionScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');

            const answerCounts = Object.entries(userAnswers);
            let dominantPersonality = 'a';
            if (answerCounts.length > 0) {
                dominantPersonality = answerCounts.sort((a, b) => b[1] - a[1])[0][0];
            }
            
            const result = quizResults[dominantPersonality];
            localStorage.setItem('moneyPersonality', result.title);

            resultDisplay.innerHTML = `
                <span class="result-badge" style="background-color: var(--color-${result.color.toLowerCase()});">${result.title}</span>
                <h3 class="result-title">You are The ${result.title}!</h3>
                <p class="result-description">${result.description}</p>
                <div class="result-details">
                    <p><strong>Strengths:</strong> ${result.strengths}</p>
                    <p><strong>Growth Areas:</strong> ${result.growth}</p>
                </div>
            `;
            
            personalizedCta.innerHTML = `
                <h4>Your Recommended Next Step:</h4>
                <p>Based on your results, you'd feel right at home in <strong>${result.circle}.</strong></p>
                <a href="#" class="button button-primary js-open-contact-modal" data-title="Apply to Join ${result.circle}" data-circle="${result.circle}">${result.ctaText}</a>
            `;
            personalizedCta.classList.remove('hidden');
            
            // Re-attach event listener to the new button inside the modal
            const ctaBtn = personalizedCta.querySelector('.js-open-contact-modal');
            if (ctaBtn) {
                ctaBtn.addEventListener('click', (e) => {
                    handleOpenContactModal(e);
                    closeQuizModal();
                });
            }
        }

        function resetQuiz() {
            startScreen.classList.remove('hidden');
            questionScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            resultDisplay.innerHTML = '';
            personalizedCta.innerHTML = '';
            personalizedCta.classList.add('hidden');
            localStorage.removeItem('moneyPersonality');
        }

        openQuizBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuizModal();
        }));

        if(startQuizBtnModal) startQuizBtnModal.addEventListener('click', startQuiz);
        if(closeQuizBtn) closeQuizBtn.addEventListener('click', closeQuizModal);
        
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                closeQuizModal();
            }
        });
    }

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            const answerPanel = item.querySelector('.faq-answer');
            const answerContent = answerPanel.querySelector('.faq-content');

            if (questionButton && answerPanel && answerContent) {
                questionButton.addEventListener('click', () => {
                    const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

                    questionButton.setAttribute('aria-expanded', !isExpanded);
                    answerPanel.classList.toggle('open');

                    if (answerPanel.classList.contains('open')) {
                        // Set max-height to the content's scroll height for the open animation
                        answerPanel.style.maxHeight = answerContent.scrollHeight + 'px';
                    } else {
                        // Unset max-height for the close animation
                        answerPanel.style.maxHeight = null;
                    }
                });
            }
        });
    }

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
