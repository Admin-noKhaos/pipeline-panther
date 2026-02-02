// Quiz State
let currentQuestion = 0;
let answers = {};

// Question order
const questions = ['intro', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'contact-form', 'results'];

// Start Quiz
function startQuiz() {
    currentQuestion = 1;
    showQuestion(1);
    updateProgress();
}

// Show Question
function showQuestion(num) {
    // Hide all screens
    document.querySelectorAll('.quiz-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show current question
    const questionId = questions[num];
    const screen = document.getElementById(questionId);
    if (screen) {
        screen.classList.add('active');
        currentQuestion = num;
        updateProgress();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Next Question
function nextQuestion(num) {
    // Get answer for current question
    const questionId = `q${num}`;
    const selected = document.querySelector(`input[name="${questionId}"]:checked`);
    
    if (!selected && num > 0) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    if (selected) {
        answers[questionId] = selected.value;
    }
    
    // Move to next question
    if (num < 8) {
        showQuestion(num + 1);
    } else {
        // Move to contact form
        showQuestion(9);
    }
}

// Previous Question
function prevQuestion(num) {
    if (num > 1) {
        showQuestion(num - 1);
    } else {
        showQuestion(0); // Go back to intro
    }
}

// Update Progress Bar
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (currentQuestion === 0) {
        progressBar.style.width = '0%';
    } else if (currentQuestion <= 8) {
        progressBar.style.width = `${(currentQuestion / 8) * 100}%`;
    } else {
        progressBar.style.width = '100%';
    }
}

// Calculate Tier and Score
function calculateTier() {
    const q1 = answers.q1;
    const q3 = answers.q3;
    const q5 = answers.q5;
    const q6 = answers.q6;
    const q7 = answers.q7;
    const q8 = answers.q8;
    
    // Define flags
    const isDecisionMaker = [
        "VP Sales / Head of Sales / CRO",
        "Head of Revenue Operations / Sales Operations",
        "CIO / VP IT / Head of Systems",
        "Founder / CEO"
    ].includes(q1);
    
    const isIdealSize = ["50–249", "250–999"].includes(q3);
    
    const hasNearTermIntent = [
        "We're actively looking for partners to help us in the next 3 months",
        "We're actively looking for partners to help us in the next 4–6 months",
        "We know we need to fix / revamp this in the next 6–12 months"
    ].includes(q6);
    
    const reportsPain = q5 !== "Honestly, it's working fine for us right now";
    
    const severeExperiencePain = (
        ["Almost every quarter – it's way off", "Often – more off than on"].includes(q7) ||
        ["I don't trust it – we double‑check in spreadsheets or gut", "Somewhat – we spot‑check and adjust a lot"].includes(q8)
    );
    
    const moderateExperiencePain = (
        q7 === "Sometimes – a bit off, but manageable" ||
        q8 === "Mostly – we can rely on it for most decisions"
    );
    
    // Tier selection
    let tier = 'C';
    let displayScore = 5.6;
    let displayLabel = "Unstable / Unclear Pipeline";
    let variant = 1;
    
    // Tier A
    if (isDecisionMaker && isIdealSize && hasNearTermIntent && reportsPain && severeExperiencePain) {
        tier = 'A';
        displayScore = 2.9;
        displayLabel = "Severe Pipeline Failure Risk";
        variant = Math.floor(Math.random() * 2) + 1; // Random variant 1 or 2
    }
    // Tier B
    else if (isDecisionMaker && reportsPain && (isIdealSize || ["30–49", "1,000+"].includes(q3)) && (moderateExperiencePain || q6 === "We're exploring options, but no clear plan or budget yet")) {
        tier = 'B';
        displayScore = 4.1;
        displayLabel = "High‑Risk Pipeline";
        variant = Math.floor(Math.random() * 3) + 1; // Random variant 1, 2, or 3
    }
    // Tier C (default)
    else {
        variant = Math.floor(Math.random() * 3) + 1; // Random variant 1, 2, or 3
    }
    
    return { tier, displayScore, displayLabel, variant, q1, q3 };
}

// Get Result Content
function getResultContent(tier, score, label, variant, role, companySize) {
    let content = '';
    
    if (tier === 'A') {
        if (variant === 1) {
            content = `
                <div class="result-header tier-a">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        Based on your answers, you're a <strong>${role}</strong> at a <strong>${companySize} employee</strong> B2B company, planning CRM/ERP work in the next 3–12 months. You also told us your forecast is often way off and you don't fully trust the data in your system.
                    </p>
                    <p class="result-text">
                        That combination is dangerous: you're making big growth decisions on numbers you don't believe, right before you invest more into the same broken setup.
                    </p>
                </div>
            `;
        } else {
            content = `
                <div class="result-header tier-a">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        You reported a serious mismatch between what your CRM/ERP says and what actually closes, plus low confidence in the data your team is entering. For a team at your size and stage, that usually means deals are slipping through the cracks and your forecast is more of a guess than a plan.
                    </p>
                    <p class="result-text">
                        In plain English: your pipeline is lying to you, and the bigger you grow on top of it, the more expensive those lies become.
                    </p>
                    <p class="result-text">
                        You're big enough that bad data and missed follow‑ups are now a real revenue leak, and your own answers say you feel that weekly. This isn't a tooling problem; it's a setup problem. Until you fix the way your CRM/ERP is implemented, every forecast and growth plan sits on a cracked foundation.
                    </p>
                </div>
            `;
        }
    } else if (tier === 'B') {
        if (variant === 1) {
            content = `
                <div class="result-header tier-b">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        You're not on fire yet, but your answers say it plainly: your forecast is unreliable, your team doesn't fully trust the CRM/ERP, and you're already seeing deals fall through the cracks.
                    </p>
                    <p class="result-text">
                        This is the danger zone. It feels "manageable" day‑to‑day, but every new rep and every new opportunity is being piled on top of a shaky system. If you try to scale on this, you're betting your targets, your bonuses, and your reputation on numbers you already know are wrong.
                    </p>
                </div>
            `;
        } else if (variant === 2) {
            content = `
                <div class="result-header tier-b">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        You told us you still get surprised by what actually closes and that your data needs constant fixing. That means every forecast you present to your leadership or board is part data, part guess.
                    </p>
                    <p class="result-text">
                        In this range, most teams don't blow up overnight. They just quietly bleed: reps chase bad deals, good deals get ignored, and you miss targets by "a little" every quarter until it becomes the new normal.
                    </p>
                </div>
            `;
        } else {
            content = `
                <div class="result-header tier-b">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        Right now you're in the worst possible spot: the system is painful enough that you feel it, but not broken enough to force an emergency rebuild. That's how teams get stuck for years with a CRM/ERP everyone complains about, no one truly owns, and everyone quietly works around in spreadsheets.
                    </p>
                    <p class="result-text">
                        The longer you stay here, the more expensive and politically painful the eventual fix becomes.
                    </p>
                </div>
            `;
        }
    } else {
        if (variant === 1) {
            content = `
                <div class="result-header tier-c">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        You're not in crisis, but you also didn't describe a setup you'd bet the next stage of growth on. When the forecast is "mostly right" and the data is "mostly trusted," what usually happens is simple: you leave money on the table without realizing how much.
                    </p>
                    <p class="result-text">
                        That's the trap. Because nothing is obviously broken, fixing it never becomes urgent… until you miss a big target and have to admit the system underneath was never truly solid.
                    </p>
                </div>
            `;
        } else if (variant === 2) {
            content = `
                <div class="result-header tier-c">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        Your answers suggest a pipeline that works well enough to keep things moving, but not well enough to give you real confidence. You might hit goals while things are small, but as volume increases, small data issues and adoption gaps compound into missed follow‑ups, fuzzy forecasts, and "we should have seen that coming" moments.
                    </p>
                </div>
            `;
        } else {
            content = `
                <div class="result-header tier-c">
                    <div class="result-score">${score} / 10</div>
                    <div class="result-label">${label}</div>
                </div>
                <div class="result-content">
                    <p class="result-text">
                        You're in the "it's fine for now" zone. That's exactly where most teams are right before they outgrow their process. On the surface, things look okay; underneath, you've already got enough noise in your CRM/ERP that a few more reps or a few bigger deals could push it past its limit fast.
                    </p>
                </div>
            `;
        }
    }
    
    return content + `
        <div class="result-cta">
            <h3>Ready to Fix Your Pipeline?</h3>
            <p>Let's discuss how Pipeline Panther can help transform your sales process.</p>
            <a href="index.html#contact" class="btn btn-primary btn-large">Get Started</a>
        </div>
    `;
}

// Submit Quiz
function submitQuiz(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const contactInfo = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        website: formData.get('website')
    };
    
    // Calculate tier
    const { tier, displayScore, displayLabel, variant, q1, q3 } = calculateTier();
    
    // Store results
    const results = {
        tier,
        score: displayScore,
        label: displayLabel,
        variant,
        answers,
        contactInfo
    };
    
    // Log results (in production, send to backend)
    console.log('Quiz Results:', results);
    
    // Show results
    showResults(tier, displayScore, displayLabel, variant, q1, q3);
}

// Show Results
function showResults(tier, score, label, variant, role, companySize) {
    // Hide all screens
    document.querySelectorAll('.quiz-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show results
    const resultsScreen = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = getResultContent(tier, score, label, variant, role, companySize);
    resultsScreen.classList.add('active');
    
    // Update progress to 100%
    updateProgress();
    document.getElementById('progressBar').style.width = '100%';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});

