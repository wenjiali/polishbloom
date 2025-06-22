document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');

    for (const link of navLinks) {
        link.addEventListener('click', smoothScroll);
    }

    function smoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetPosition = document.querySelector(targetId).offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        window.requestAnimationFrame(step);

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
    }

    // Easing function
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // --- Quiz Logic ---
    const quizData = [
        {
            question: "When you think about money, what feeling comes up most often?",
            answers: [
                { text: "Security and stability", value: "a" },
                { text: "Freedom and adventure", value: "b" },
                { text: "Control and planning", value: "c" },
                { text: "Generosity and sharing", value: "d" },
                { text: "Creativity and flexibility", value: "e" },
                { text: "Calm and balance", value: "f" },
                { text: "Ambition and growth", value: "g" },
            ]
        },
        {
            question: "How do you usually make financial decisions?",
            answers: [
                { text: "Careful research and long-term thinking", value: "a" },
                { text: "Following your intuition and gut feelings", value: "b" },
                { text: "Creating detailed budgets and plans", value: "c" },
                { text: "Consulting with trusted friends or family", value: "d" },
                { text: "Experimenting with new ideas and approaches", value: "e" },
                { text: "Going with the flow and staying mindful", value: "f" },
                { text: "Setting big goals and chasing opportunities", value: "g" },
            ]
        },
        {
            question: "What motivates you most about managing money?",
            answers: [
                { text: "Building a safe future", value: "a" },
                { text: "Experiencing life fully", value: "b" },
                { text: "Having complete control", value: "c" },
                { text: "Supporting others and community", value: "d" },
                { text: "Expressing yourself uniquely", value: "e" },
                { text: "Maintaining peace of mind", value: "f" },
                { text: "Achieving success and influence", value: "g" },
            ]
        },
        {
            question: "What's your biggest challenge with money?",
            answers: [
                { text: "Worrying about unexpected expenses", value: "a" },
                { text: "Staying committed to savings", value: "b" },
                { text: "Keeping track of every detail", value: "c" },
                { text: "Saying no to requests for help", value: "d" },
                { text: "Finding the right balance between risk and fun", value: "e" },
                { text: "Avoiding financial stress", value: "f" },
                { text: "Feeling overwhelmed by opportunities", value: "g" },
            ]
        },
        {
            question: "How does money affect your relationships with family or partner?",
            answers: [
                { text: "I prioritize financial security for them.", value: "a" },
                { text: "I want to share joyful experiences without stress.", value: "b" },
                { text: "I prefer clear money roles and plans with loved ones.", value: "c" },
                { text: "I often give or lend money to support family or friends.", value: "d" },
                { text: "I like mixing creativity and fun in shared finances.", value: "e" },
                { text: "I try to keep money talk calm and avoid conflict.", value: "f" },
                { text: "I feel pressure to be a financial role model or provider.", value: "g" },
            ]
        },
        {
            question: "How do financial conversations typically go in your close relationships?",
            answers: [
                { text: "We plan carefully and discuss finances openly.", value: "a" },
                { text: "We focus on shared dreams and spontaneous fun.", value: "b" },
                { text: "We set clear budgets and financial goals.", value: "c" },
                { text: "We openly support each other's needs.", value: "d" },
                { text: "We brainstorm new money ideas together.", value: "e" },
                { text: "We avoid stress by keeping discussions light.", value: "f" },
                { text: "We push each other to achieve more financially.", value: "g" },
            ]
        },
        {
            question: "How does your career relate to your money mindset?",
            answers: [
                { text: "I seek stability and steady growth.", value: "a" },
                { text: "I want freedom and flexibility in work and income.", value: "b" },
                { text: "I plan career moves with clear financial goals.", value: "c" },
                { text: "I value work that supports my community or family.", value: "d" },
                { text: "I pursue creative or entrepreneurial ventures.", value: "e" },
                { text: "I prefer balance and avoid burnout.", value: "f" },
                { text: "I aim for leadership and high earnings.", value: "g" },
            ]
        },
        {
            question: "How do you practice self-love in your financial life?",
            answers: [
                { text: "I save and invest for my future security.", value: "a" },
                { text: "I spend on experiences that bring me joy.", value: "b" },
                { text: "I track progress and celebrate milestones.", value: "c" },
                { text: "I use money to care for others and myself.", value: "d" },
                { text: "I try new ways to make money meaningful.", value: "e" },
                { text: "I remind myself to relax and not stress over money.", value: "f" },
                { text: "I challenge myself to grow financially and personally.", value: "g" },
            ]
        },
        {
            question: "When faced with a financial setback, how do you respond?",
            answers: [
                { text: "I review my plan and adjust carefully.", value: "a" },
                { text: "I look for new opportunities and stay positive.", value: "b" },
                { text: "I double down on budgeting and control.", value: "c" },
                { text: "I seek support from loved ones.", value: "d" },
                { text: "I get creative to find solutions.", value: "e" },
                { text: "I focus on self-care and emotional balance.", value: "f" },
                { text: "I tackle it head-on with determination.", value: "g" },
            ]
        },
        {
            question: "What role does money play in your overall happiness?",
            answers: [
                { text: "It gives me peace of mind and security.", value: "a" },
                { text: "It allows me to explore and enjoy life.", value: "b" },
                { text: "It helps me feel organized and in control.", value: "c" },
                { text: "It empowers me to give and connect.", value: "d" },
                { text: "It fuels my creativity and passions.", value: "e" },
                { text: "It helps me maintain inner calm.", value: "f" },
                { text: "It drives my ambitions and achievements.", value: "g" },
            ]
        }
    ];

    const resultMapping = {
        a: { color: "Blue", title: "The Secure Planner" },
        b: { color: "Yellow", title: "The Free Spirit" },
        c: { color: "Green", title: "The Strategist" },
        d: { color: "Pink", title: "The Nurturer" },
        e: { color: "Orange", title: "The Creator" },
        f: { color: "Purple", title: "The Peacekeeper" },
        g: { color: "Red", title: "The Achiever" }
    };

    const quizStartScreen = document.getElementById('quiz-start-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizQuestionScreen = document.getElementById('quiz-question-screen');
    const quizResultsScreen = document.getElementById('quiz-results-screen');
    const quizResultDisplay = document.getElementById('quiz-result-display');

    let currentQuestionIndex = 0;
    let scores = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };

    if(startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    function startQuiz() {
        quizStartScreen.classList.add('hidden');
        quizQuestionScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const questionData = quizData[currentQuestionIndex];
        quizQuestionScreen.innerHTML = `
            <p class="quiz-question">${currentQuestionIndex + 1}. ${questionData.question}</p>
            <ul class="quiz-answers">
                ${questionData.answers.map(answer => `
                    <li><button data-value="${answer.value}">${answer.text}</button></li>
                `).join('')}
            </ul>
        `;
        
        const answerButtons = quizQuestionScreen.querySelectorAll('.quiz-answers button');
        answerButtons.forEach(button => {
            button.addEventListener('click', selectAnswer);
        });
    }

    function selectAnswer(event) {
        const selectedValue = event.target.dataset.value;
        scores[selectedValue]++;
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        let maxScore = 0;
        let resultKey = 'a';

        for (const key in scores) {
            if (scores[key] > maxScore) {
                maxScore = scores[key];
                resultKey = key;
            }
        }

        const result = resultMapping[resultKey];
        if (quizResultDisplay) {
            quizResultDisplay.innerHTML = `
                <p class="result-intro">Your dominant money personality is:</p>
                <h3 class="result-title">${result.color} — ${result.title}</h3>
            `;
        }
        
        quizQuestionScreen.classList.add('hidden');
        quizResultsScreen.classList.remove('hidden');
    }

    // --- Money Reflection Pop-up Logic ---
    const reflectionPrompts = [
        "What was your earliest memory of money?",
        "What would your life feel like if your money was a garden?",
        "If your wallet could talk, what would it say to you?",
        "What is one money belief you inherited that you're ready to let go of?",
        "How can you bring more joy into the act of managing your finances?",
        "Describe a time you felt truly abundant, with or without money."
    ];

    const popup = document.getElementById('reflection-popup');
    const closeBtn = document.getElementById('close-popup-btn');
    const promptText = document.getElementById('reflection-prompt-text');

    if (popup && !sessionStorage.getItem('promptSeen')) {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * reflectionPrompts.length);
            promptText.textContent = reflectionPrompts[randomIndex];
            popup.classList.add('visible');
        }, 5000); 
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('visible');
            sessionStorage.setItem('promptSeen', 'true');
        });
    }

    // --- Dynamic Hero Headline Logic ---
    const rotatingTextElement = document.getElementById('rotating-text');
    if (rotatingTextElement) {
        const rotatingPhrases = [
            "Polish Your Mind.",
            "Bloom Your Life.",
            "Find Your Clarity.",
            "Grow Your Wealth."
        ];
        let phraseIndex = 0;

        setInterval(() => {
            rotatingTextElement.classList.add('fade-out');

            setTimeout(() => {
                phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
                rotatingTextElement.textContent = rotatingPhrases[phraseIndex];
                rotatingTextElement.classList.remove('fade-out');
            }, 400); // This must match the CSS transition duration
        }, 3000); // Change text every 3 seconds
    }
}); 