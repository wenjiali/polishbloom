document.addEventListener('DOMContentLoaded', () => {
    // --- CONTACT MODAL LOGIC (runs on all pages with the modal) ---
    const contactModal = document.getElementById('contact-modal');
    const openContactModalBtns = document.querySelectorAll('.js-open-contact-modal');

    if (contactModal && openContactModalBtns.length > 0) {
        const contactModalTitle = document.getElementById('contact-modal-title');
        const closeContactBtn = document.getElementById('close-contact-btn');
        const contactForm = document.getElementById('contact-form');
        const moneyPersonalityDropdown = document.getElementById('money-personality');
        const formSuccessMessage = document.getElementById('form-success-message');

        function openContactModal(title, circle) {
            contactModalTitle.textContent = title;

            // Pre-fill dropdown if circle is passed
            if (circle && moneyPersonalityDropdown) {
                moneyPersonalityDropdown.value = circle;
            } else {
                // Otherwise, use value from localStorage (from quiz) or clear it
                const personality = localStorage.getItem('moneyPersonality');
                if (personality && moneyPersonalityDropdown) {
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

    // --- QUIZ LOGIC (runs only on the main page) ---
    const quizModal = document.getElementById('quiz-modal');
    if (quizModal) {
        const startQuizBtn = document.getElementById('start-quiz-btn');
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

        function openQuizModal() { quizModal.classList.remove('hidden'); }
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

        startQuizBtn.addEventListener('click', openQuizModal);
        closeQuizBtn.addEventListener('click', closeQuizModal);
        beginQuizBtn.addEventListener('click', startQuiz);
        if (seeAllProgramsBtn) {
            seeAllProgramsBtn.addEventListener('click', closeQuizModal);
        }
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                closeQuizModal();
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