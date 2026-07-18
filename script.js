/**
 * CryptoBox – Password Strength Checker & Generator
 * Core Application Script (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        theme: localStorage.getItem('cryptobox_theme') || 'dark',
        activeTab: 'checker',
        history: JSON.parse(localStorage.getItem('cryptobox_history')) || [],
        factIndex: 0
    };

    // --- DOM ELEMENT REFERENCES ---
    // Navigation & Theme
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabViews = document.querySelectorAll('.tab-view');

    // Password Checker
    const mainPasswordInput = document.getElementById('main-password-input');
    const togglePwdVisibility = document.getElementById('toggle-pwd-visibility');
    const warningBanner = document.getElementById('warning-banner');
    const strengthRatingLabel = document.getElementById('strength-rating-label');
    const strengthBarIndicator = document.getElementById('strength-bar-indicator');
    const recommendationsContainer = document.getElementById('rec-list-container');
    const circularScoreRing = document.getElementById('circular-score-ring');
    const numericalScore = document.getElementById('numerical-score');

    // Stats Dashboard
    const statLength = document.getElementById('stat-length');
    const statVariety = document.getElementById('stat-variety');
    const statEntropy = document.getElementById('stat-entropy');
    const statCrack = document.getElementById('stat-crack');

    // Checklist elements
    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleLower = document.getElementById('rule-lower');
    const ruleNumber = document.getElementById('rule-number');
    const ruleSymbol = document.getElementById('rule-symbol');
    const ruleRepeats = document.getElementById('rule-repeats');
    const ruleSequences = document.getElementById('rule-sequences');
    const ruleCommon = document.getElementById('rule-common');

    // Generator elements
    const generatorLenSlider = document.getElementById('generator-len-slider');
    const lenSliderValue = document.getElementById('len-slider-value');
    const genOptUppercase = document.getElementById('gen-opt-uppercase');
    const genOptLowercase = document.getElementById('gen-opt-lowercase');
    const genOptNumbers = document.getElementById('gen-opt-numbers');
    const genOptSymbols = document.getElementById('gen-opt-symbols');
    const genOptExcludeSimilar = document.getElementById('gen-opt-exclude-similar');
    const genPasswordDisplay = document.getElementById('gen-password-display');
    const copyGeneratedBtn = document.getElementById('copy-generated-btn');
    const refreshGeneratorBtn = document.getElementById('refresh-generator-btn');
    const triggerGenerationBtn = document.getElementById('trigger-generation-btn');
    const genStrengthLabel = document.getElementById('gen-strength-label');
    const genStrengthBanner = document.getElementById('gen-strength-banner');

    // History elements
    const historyItemsContainer = document.getElementById('history-items-container');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Tips & Facts elements
    const rotatingFactContent = document.getElementById('rotating-fact-content');
    const refreshFactBtn = document.getElementById('refresh-fact-btn');

    // Toasts
    const toastWrapper = document.getElementById('toast-wrapper');

    // --- DATA STORE (BLACKLIST & FACTS) ---
    // 170+ common weak passwords
    const commonPasswordsBlacklist = [
        '123456', 'password', '123456789', 'qwerty', '12345678', '111111', '12345', '1234567', '1234', '123123',
        'letmein', 'welcome', 'admin', 'iloveyou', 'password123', 'pass', 'secret', 'login', 'system', 'root',
        'oracle', 'cisco', '1234567890', '000000', '123321', '666666', '888888', '777777', '999999', 'shadow',
        'superman', 'football', 'monkey', 'cookie', 'mustang', 'hunter2', 'charlie', 'jessica', 'michael', 'jennifer',
        'princess', 'daniel', 'thomas', 'security', 'hacking', 'cracker', 'database', 'access', 'network', 'firewall',
        'server', 'hacker', 'support', 'manager', 'student', 'teacher', 'online', 'office', 'windows', 'microsoft',
        'google', 'apple', 'android', 'galaxy', 'iphone', 'laptop', 'desktop', 'computer', 'keyboard', 'monitor',
        'screen', 'mouse', 'printer', 'router', 'gateway', 'switch', 'packet', 'cyber', 'crypto', 'bitcoin',
        'ethereum', 'dollar', 'money', 'credit', 'safety', 'danger', 'alert', 'purple', 'black', 'white',
        'green', 'yellow', 'blue', 'pink', 'spring', 'summer', 'autumn', 'winter', 'january', 'february', 'march',
        'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'monday',
        'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night',
        'sunshine', 'shadows', 'freedom', 'justice', 'america', 'london', 'tokyo', 'paris', 'berlin', 'madrid',
        'rome', 'toronto', 'sydney', 'united', 'kingdom', 'states', 'canada', 'europe', 'asia', 'africa',
        'soccer', 'tennis', 'hockey', 'rugby', 'cricket', 'baseball', 'basketball', 'running', 'swimming', 'biking',
        'hiking', 'climbing', 'guitar', 'piano', 'drums', 'violin', 'flute', 'trumpet', 'singer', 'music',
        'dance', 'movie', 'actor', 'drama', 'comedy', 'horror', 'action', 'gaming', 'gamer', 'player',
        'winner', 'loser', 'champion', 'legend', 'master', 'johnny', 'killer', 'monkey1', 'dragon', 'shadow1'
    ];

    const cybersecurityFacts = [
        "In 2023, 81% of data breaches were caused by stolen, weak, or reused passwords.",
        "An offline GPU cluster cracking rig can test over 100 billion combinations per second against standard MD5 or NTLM password hashes.",
        "Using spaces in a password (creating a 'passphrase') dramatically increases entropy and length, making it much harder to crack while remaining easy to remember.",
        "A standard 8-character password containing numbers, letters, and symbols can be cracked within minutes using modern consumer graphics cards (GPUs).",
        "Many security standards now recommend focusing on length (e.g., 16+ characters) rather than frequent password rotations, which often result in weaker, predictable changes.",
        "Multi-Factor Authentication (MFA) can block over 99.9% of account compromise attacks, even if attackers know the password.",
        "Credential Stuffing is an automated cyberattack where hackers test millions of leaked username/password combinations across multiple sites.",
        "Hashing is a one-way mathematical function that maps a password to a fixed-length string. If databases are breached, hackers must brute-force the hashes to retrieve the raw password.",
        "Salting is the practice of adding a random string of characters to a password before hashing it. This makes pre-computed hash dictionary attacks (rainbow tables) completely useless.",
        "The word 'password' and numbers like '123456' have remained the most common passwords globally for over two decades.",
        "Social Engineering (phishing, vishing, baiting) is the most common way hackers steal strong passwords without needing to crack them.",
        "A password of 12 random characters from a pool of 94 characters yields roughly 78 bits of entropy. It would take a trillion years for a supercomputer to guess.",
        "Keyloggers are malicious hardware or software that log every keystroke you make, allowing attackers to harvest passwords as you type them.",
        "Symmetric encryption keys (like AES-256) are virtually uncrackable by brute force, as the number of combinations is larger than the number of atoms in the observable universe."
    ];

    // --- INITIALIZATION ---
    function init() {
        // Apply saved theme
        htmlEl.setAttribute('data-theme', state.theme);
        updateThemeToggleIcon();

        // Register event listeners
        themeToggleBtn.addEventListener('click', toggleTheme);
        tabButtons.forEach(btn => btn.addEventListener('click', handleTabSwitch));

        // Checker input listeners
        mainPasswordInput.addEventListener('input', () => {
            const val = mainPasswordInput.value;
            evaluatePassword(val);
        });
        
        // Auto-save to history on input blur (if password not empty)
        mainPasswordInput.addEventListener('blur', () => {
            const val = mainPasswordInput.value;
            if (val.trim()) {
                saveToHistory(val);
            }
        });

        togglePwdVisibility.addEventListener('click', toggleInputVisibility);

        // Generator listeners
        generatorLenSlider.addEventListener('input', () => {
            lenSliderValue.textContent = generatorLenSlider.value;
            updateGeneratorStrengthPreview();
        });
        
        [genOptUppercase, genOptLowercase, genOptNumbers, genOptSymbols, genOptExcludeSimilar].forEach(opt => {
            opt.addEventListener('change', updateGeneratorStrengthPreview);
        });

        triggerGenerationBtn.addEventListener('click', generatePassword);
        copyGeneratedBtn.addEventListener('click', copyGeneratedPassword);
        refreshGeneratorBtn.addEventListener('click', generatePassword);

        // History listeners
        clearHistoryBtn.addEventListener('click', clearHistory);

        // Fact panel listeners
        refreshFactBtn.addEventListener('click', rotateFact);

        // Global shortcuts listener
        window.addEventListener('keydown', handleKeyboardShortcuts);

        // Initial renderings
        evaluatePassword('');
        renderHistory();
        rotateFact();
        updateGeneratorStrengthPreview();
    }

    // --- THEME & TAB SWITCHING ---
    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', state.theme);
        localStorage.setItem('cryptobox_theme', state.theme);
        updateThemeToggleIcon();
        showToast(
            `Switched to ${state.theme.toUpperCase()} mode`, 
            'success', 
            state.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'
        );
    }

    function updateThemeToggleIcon() {
        const icon = themeToggleBtn.querySelector('i');
        if (state.theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    function handleTabSwitch(e) {
        const clickedBtn = e.currentTarget;
        const targetTab = clickedBtn.getAttribute('data-tab');
        
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabViews.forEach(view => view.classList.remove('active'));

        clickedBtn.classList.add('active');
        clickedBtn.setAttribute('aria-selected', 'true');
        document.getElementById(`${targetTab}-view`).classList.add('active');
        state.activeTab = targetTab;
    }

    // --- PASSWORD VISIBILITY ---
    function toggleInputVisibility() {
        const isPwd = mainPasswordInput.type === 'password';
        mainPasswordInput.type = isPwd ? 'text' : 'password';
        
        const icon = togglePwdVisibility.querySelector('i');
        icon.className = isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        
        showToast(
            isPwd ? 'Password revealed' : 'Password hidden', 
            'info', 
            isPwd ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'
        );
    }

    // --- CORE CRYPTOBOX EVALUATION ENGINE ---
    
    // Checks for repeating consecutive strings (e.g. aaa, 111, @@@)
    function hasConsecutiveRepeats(str) {
        return /(.)\1{2,}/.test(str);
    }

    // Checks for low density of unique characters (e.g. abcabcabc)
    function hasLowUniqueDensity(str) {
        if (str.length <= 5) return false;
        const uniqueCount = new Set(str).size;
        return (uniqueCount / str.length) < 0.45;
    }

    // Checks for keyboard or alphabetical sequences of length 3 or more
    function hasSequentialCharacters(str) {
        const s = str.toLowerCase();
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const revAlphabet = 'zyxwvutsrqponmlkjihgfedcba';
        const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
        const numeric = '01234567890';
        const revNumeric = '09876543210';
        
        for (let i = 0; i <= s.length - 3; i++) {
            const chunk = s.substring(i, i + 3);
            if (alphabet.includes(chunk) || revAlphabet.includes(chunk)) return true;
            if (numeric.includes(chunk) || revNumeric.includes(chunk)) return true;
            for (const row of keyboardRows) {
                if (row.includes(chunk) || row.split('').reverse().join('').includes(chunk)) return true;
            }
        }
        return false;
    }

    // Main analysis function
    function analyzePasswordDetails(pwd) {
        const results = {
            length: pwd.length,
            hasUpper: /[A-Z]/.test(pwd),
            hasLower: /[a-z]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSymbol: /[^A-Za-z0-9\s]/.test(pwd),
            hasSpace: /\s/.test(pwd),
            hasRepeats: hasConsecutiveRepeats(pwd) || hasLowUniqueDensity(pwd),
            hasSequences: hasSequentialCharacters(pwd),
            isCommon: commonPasswordsBlacklist.includes(pwd.toLowerCase()),
            score: 0,
            entropy: 0,
            crackTimeSeconds: 0,
            crackTimeReadable: 'Instant',
            strength: 'EMPTY'
        };

        if (pwd.length === 0) {
            return results;
        }

        // Calculate Character Pool size (R)
        let poolSize = 0;
        let activeCategories = 0;
        if (results.hasLower) { poolSize += 26; activeCategories++; }
        if (results.hasUpper) { poolSize += 26; activeCategories++; }
        if (results.hasNumber) { poolSize += 10; activeCategories++; }
        if (results.hasSymbol) { poolSize += 32; activeCategories++; } // standard keyboard symbol count
        if (results.hasSpace) { poolSize += 1; }

        results.varietyClasses = activeCategories;

        // Calculate Entropy: E = L * log2(R)
        if (poolSize > 0) {
            results.entropy = results.length * Math.log2(poolSize);
        }

        // Calculate Score (0-100 scale)
        let computedScore = 0;

        // 1. Length points
        if (results.length < 8) {
            computedScore += results.length * 2.5; // max 17.5
        } else {
            computedScore += 20; // baseline for >= 8 chars
            if (results.length >= 12) computedScore += 15; // bonus for security baseline length
            if (results.length >= 16) computedScore += 10; // extra long bonus
            if (results.length >= 20) computedScore += 5;  // super long bonus
        } // Max length contribution = 50 points

        // 2. Variety points
        if (results.hasLower) computedScore += 10;
        if (results.hasUpper) computedScore += 15; // uppercase is slightly harder to force
        if (results.hasNumber) computedScore += 10;
        if (results.hasSymbol) computedScore += 15; // symbols add rich variety
        // Max variety contribution = 50 points

        // Deductions
        if (results.isCommon) {
            computedScore = 0; // Blacklisted passwords have zero strength
        } else {
            // Deduct for sequential characters
            if (results.hasSequences) {
                computedScore -= 15;
            }
            // Deduct for repeats
            if (results.hasRepeats) {
                computedScore -= 15;
            }
            // Deduct if character set is severely limited (e.g. only numbers or only letters)
            if (activeCategories === 1 && results.length >= 8) {
                computedScore -= 15;
            }
        }

        // Clamp score between 0 and 100
        results.score = Math.max(0, Math.min(100, Math.round(computedScore)));

        // Determine Strength Level
        if (results.score <= 20) {
            results.strength = 'VERY WEAK';
        } else if (results.score <= 40) {
            results.strength = 'WEAK';
        } else if (results.score <= 65) {
            results.strength = 'MEDIUM';
        } else if (results.score <= 85) {
            results.strength = 'STRONG';
        } else {
            results.strength = 'VERY STRONG';
        }

        // Crack Time estimation (Offline GPU Hash Crack rate: 10 billion (10^10) guesses/sec)
        const guessesPerSec = 10000000000;
        const totalCombinations = Math.pow(poolSize || 1, results.length);
        
        results.crackTimeSeconds = totalCombinations / guessesPerSec;
        results.crackTimeReadable = getReadableCrackTime(results.crackTimeSeconds);

        return results;
    }

    // Formatter for crack times
    function getReadableCrackTime(seconds) {
        if (seconds === 0 || isNaN(seconds)) return 'Instant';
        if (seconds < 1) return 'Instant';
        
        const mins = 60;
        const hours = mins * 60;
        const days = hours * 24;
        const months = days * 30;
        const years = days * 365;
        const thousandYears = years * 1000;
        const millionYears = years * 1000000;
        const billionYears = years * 1000000000;

        if (seconds < mins) return `${Math.round(seconds)} seconds`;
        if (seconds < hours) return `${Math.round(seconds / mins)} minutes`;
        if (seconds < days) return `${Math.round(seconds / hours)} hours`;
        if (seconds < days * 2) return `1 day`;
        if (seconds < months) return `${Math.round(seconds / days)} days`;
        if (seconds < years) return `${Math.round(seconds / months)} months`;
        if (seconds < thousandYears) return `${Math.round(seconds / years).toLocaleString()} years`;
        if (seconds < millionYears) return `${Math.round(seconds / thousandYears).toLocaleString()} thousand years`;
        if (seconds < billionYears) return `${Math.round(seconds / millionYears).toLocaleString()} million years`;
        
        const billions = seconds / billionYears;
        if (billions < 1000) {
            return `${Math.round(billions).toLocaleString()} billion years`;
        }
        return `Trillions of years`;
    }

    // Update real-time UI values based on current input
    function evaluatePassword(pwd) {
        const data = analyzePasswordDetails(pwd);

        // Update Gauge Ring
        const ringRadius = 70;
        const ringCircumference = 2 * Math.PI * ringRadius; // ~439.82
        const scoreFraction = data.score / 100;
        const strokeOffset = ringCircumference - (scoreFraction * ringCircumference);
        
        circularScoreRing.style.strokeDasharray = ringCircumference;
        circularScoreRing.style.strokeDashoffset = strokeOffset;
        numericalScore.textContent = data.score;

        // Set colors based on strength level
        let strengthColorVar = '--strength-0';
        let textClassColor = 'var(--text-strength-0)';
        
        if (pwd.length > 0) {
            if (data.strength === 'VERY WEAK') {
                strengthColorVar = '--strength-0';
                textClassColor = 'var(--text-strength-0)';
            } else if (data.strength === 'WEAK') {
                strengthColorVar = '--strength-1';
                textClassColor = 'var(--text-strength-1)';
            } else if (data.strength === 'MEDIUM') {
                strengthColorVar = '--strength-2';
                textClassColor = 'var(--text-strength-2)';
            } else if (data.strength === 'STRONG') {
                strengthColorVar = '--strength-3';
                textClassColor = 'var(--text-strength-3)';
            } else if (data.strength === 'VERY STRONG') {
                strengthColorVar = '--strength-4';
                textClassColor = 'var(--text-strength-4)';
            }
        } else {
            strengthColorVar = 'rgba(255,255,255,0.05)';
            textClassColor = 'var(--text-muted)';
        }

        // Apply colors to ring, strength labels, bar
        circularScoreRing.style.stroke = `var(${strengthColorVar})`;
        circularScoreRing.style.filter = `drop-shadow(0 0 6px var(${strengthColorVar}))`;
        
        strengthRatingLabel.textContent = pwd.length > 0 ? data.strength : 'EMPTY';
        strengthRatingLabel.style.color = textClassColor;
        
        strengthBarIndicator.style.width = `${data.score}%`;
        strengthBarIndicator.style.backgroundColor = `var(${strengthColorVar})`;

        // Show/hide dictionary blacklist warning
        if (data.isCommon) {
            warningBanner.style.display = 'flex';
        } else {
            warningBanner.style.display = 'none';
        }

        // Update Stats fields
        statLength.textContent = `${data.length} character${data.length === 1 ? '' : 's'}`;
        statVariety.textContent = `${data.varietyClasses || 0} class${data.varietyClasses === 1 ? '' : 'es'}`;
        statEntropy.textContent = `${data.entropy.toFixed(2)} bits`;
        statCrack.textContent = data.crackTimeReadable;

        // Update Checklist item indicators
        updateChecklistItem(ruleLength, data.length >= 12);
        updateChecklistItem(ruleUpper, data.hasUpper);
        updateChecklistItem(ruleLower, data.hasLower);
        updateChecklistItem(ruleNumber, data.hasNumber);
        updateChecklistItem(ruleSymbol, data.hasSymbol);
        updateChecklistItem(ruleRepeats, pwd.length > 0 && !data.hasRepeats);
        updateChecklistItem(ruleSequences, pwd.length > 0 && !data.hasSequences);
        
        // Dictionary blacklist checklist item
        if (pwd.length === 0) {
            updateChecklistItem(ruleCommon, false);
        } else {
            if (data.isCommon) {
                ruleCommon.className = 'checklist-item warning';
                ruleCommon.querySelector('.checklist-icon').innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            } else {
                ruleCommon.className = 'checklist-item met';
                ruleCommon.querySelector('.checklist-icon').innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            }
        }

        // Generate tailored Recommendations list
        generateRecommendations(pwd, data);
    }

    // Helper to format check mark / cross on checklist
    function updateChecklistItem(el, isMet) {
        const iconWrapper = el.querySelector('.checklist-icon');
        if (isMet) {
            el.classList.add('met');
            iconWrapper.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            el.classList.remove('met');
            iconWrapper.innerHTML = '<i class="fa-solid fa-circle"></i>';
        }
    }

    // Render tailor-made recommendations based on evaluation
    function generateRecommendations(pwd, data) {
        recommendationsContainer.innerHTML = '';

        if (pwd.length === 0) {
            recommendationsContainer.innerHTML = `
                <div class="rec-item success">
                    <i class="fa-solid fa-circle-check"></i> Ready to scan password. Enter a value in the input field above to analyze its strength.
                </div>
            `;
            return;
        }

        const recs = [];

        if (data.isCommon) {
            recs.push({
                text: "<strong>CRITICAL:</strong> This password is listed in dictionary databases of commonly hacked credentials. Discard this password immediately.",
                type: 'danger'
            });
        }

        if (data.length < 12) {
            recs.push({
                text: `Your password is too short (${data.length} chars). Aim for a minimum length of 12-16 characters. Larger length increases mathematical complexity.`,
                type: 'warning'
            });
        }

        if (data.varietyClasses < 3) {
            const missing = [];
            if (!data.hasUpper) missing.push("uppercase characters");
            if (!data.hasLower) missing.push("lowercase characters");
            if (!data.hasNumber) missing.push("numeric digits");
            if (!data.hasSymbol) missing.push("special symbols");
            
            recs.push({
                text: `Add more character variety. You are missing: ${missing.join(', ')}. Mixing classes increases the pool sizes for cracking.`,
                type: 'warning'
            });
        }

        if (data.hasSequences) {
            recs.push({
                text: "Remove keyboard runs or alphabetical sequences (e.g. 'abc', '123', 'qwe'). Attack dictionary tools analyze layout adjacency first.",
                type: 'warning'
            });
        }

        if (data.hasRepeats) {
            recs.push({
                text: "Avoid repeating characters in rows (e.g. 'aaa', '111') or relying on highly repetitive strings. This pattern makes guessing easier.",
                type: 'warning'
            });
        }

        // If everything is met and strength is strong
        if (recs.length === 0 && data.score >= 80) {
            recs.push({
                text: "Excellent security standard. This password has deep entropy, features diverse character classes, and does not contain simple patterns.",
                type: 'success'
            });
        }

        // Render recommendations
        recs.forEach(rec => {
            const item = document.createElement('div');
            item.className = `rec-item ${rec.type === 'success' ? 'success' : ''}`;
            
            // styling danger differently if needed
            if (rec.type === 'danger') {
                item.style.borderLeftColor = 'var(--danger)';
                item.style.background = 'rgba(239, 68, 68, 0.05)';
            }

            const icon = document.createElement('i');
            if (rec.type === 'success') {
                icon.className = 'fa-solid fa-circle-check';
            } else if (rec.type === 'danger') {
                icon.className = 'fa-solid fa-circle-xmark';
                icon.style.color = 'var(--danger)';
            } else {
                icon.className = 'fa-solid fa-circle-exclamation';
            }

            const textDiv = document.createElement('div');
            textDiv.innerHTML = rec.text;

            item.appendChild(icon);
            item.appendChild(textDiv);
            recommendationsContainer.appendChild(item);
        });
    }

    // --- CRYPTO PASSWORD GENERATOR ---
    function generatePassword() {
        const length = parseInt(generatorLenSlider.value);
        const useUpper = genOptUppercase.checked;
        const useLower = genOptLowercase.checked;
        const useNumber = genOptNumbers.checked;
        const useSymbol = genOptSymbols.checked;
        const excludeSimilar = genOptExcludeSimilar.checked;

        if (!useUpper && !useLower && !useNumber && !useSymbol) {
            showToast("Select at least one character set!", "warning", "fa-solid fa-triangle-exclamation");
            return;
        }

        // Pools
        let upperPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let lowerPool = 'abcdefghijklmnopqrstuvwxyz';
        let numberPool = '0123456789';
        let symbolPool = '!@#$%^&*()_+-=[]{}|;:\',./<>?';

        // Exclude similar characters: i, l, 1, L, o, 0, O, I, |
        const similarChars = ['i', 'l', '1', 'L', 'o', '0', 'O', 'I', '|', 'o'];
        const removeSimilar = (str) => {
            return str.split('').filter(char => !similarChars.includes(char)).join('');
        };

        if (excludeSimilar) {
            upperPool = removeSimilar(upperPool);
            lowerPool = removeSimilar(lowerPool);
            numberPool = removeSimilar(numberPool);
            symbolPool = removeSimilar(symbolPool);
        }

        const selectedPools = [];
        const guaranteedChars = [];

        if (useUpper && upperPool.length > 0) {
            selectedPools.push(upperPool);
            guaranteedChars.push(getRandomChar(upperPool));
        }
        if (useLower && lowerPool.length > 0) {
            selectedPools.push(lowerPool);
            guaranteedChars.push(getRandomChar(lowerPool));
        }
        if (useNumber && numberPool.length > 0) {
            selectedPools.push(numberPool);
            guaranteedChars.push(getRandomChar(numberPool));
        }
        if (useSymbol && symbolPool.length > 0) {
            selectedPools.push(symbolPool);
            guaranteedChars.push(getRandomChar(symbolPool));
        }

        if (selectedPools.length === 0) {
            showToast("No pool characters remaining after exclusion!", "warning", "fa-solid fa-triangle-exclamation");
            return;
        }

        // Combine pool for remaining characters
        const combinedPool = selectedPools.join('');
        const generatedArray = [...guaranteedChars];

        // Fill remaining spaces
        const remainingLength = length - guaranteedChars.length;
        for (let i = 0; i < remainingLength; i++) {
            generatedArray.push(getRandomChar(combinedPool));
        }

        // Shuffle generated array using Cryptographically secure random values where possible, or standard swap
        const shuffledArray = secureShuffle(generatedArray);
        const finalPassword = shuffledArray.join('');

        // Update UI
        genPasswordDisplay.textContent = finalPassword;
        genPasswordDisplay.classList.remove('placeholder');

        // Trigger analysis to display strength bar on generator
        const analysis = analyzePasswordDetails(finalPassword);
        updateGeneratorStrengthLabel(analysis);

        showToast("Secure key generated successfully", "success", "fa-solid fa-key");
    }

    // Grab a random char from string
    function getRandomChar(str) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const index = array[0] % str.length;
        return str.charAt(index);
    }

    // Cryptographic shuffle
    function secureShuffle(array) {
        const arr = [...array];
        const randomValues = new Uint32Array(arr.length);
        window.crypto.getRandomValues(randomValues);
        
        for (let i = arr.length - 1; i > 0; i--) {
            const j = randomValues[i] % (i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Update the visual strength color/text under generator key
    function updateGeneratorStrengthLabel(analysis) {
        genStrengthLabel.textContent = analysis.strength;
        
        let labelColor = 'var(--text-muted)';
        let borderLeftColor = 'var(--text-muted)';

        if (analysis.strength === 'VERY WEAK') {
            labelColor = 'var(--text-strength-0)';
            borderLeftColor = 'var(--strength-0)';
        } else if (analysis.strength === 'WEAK') {
            labelColor = 'var(--text-strength-1)';
            borderLeftColor = 'var(--strength-1)';
        } else if (analysis.strength === 'MEDIUM') {
            labelColor = 'var(--text-strength-2)';
            borderLeftColor = 'var(--strength-2)';
        } else if (analysis.strength === 'STRONG') {
            labelColor = 'var(--text-strength-3)';
            borderLeftColor = 'var(--strength-3)';
        } else if (analysis.strength === 'VERY STRONG') {
            labelColor = 'var(--text-strength-4)';
            borderLeftColor = 'var(--strength-4)';
        }

        genStrengthLabel.style.color = labelColor;
        genStrengthBanner.style.borderLeftColor = borderLeftColor;
    }

    // Dynamic update when generator parameters are tweaked
    function updateGeneratorStrengthPreview() {
        const length = parseInt(generatorLenSlider.value);
        const useUpper = genOptUppercase.checked;
        const useLower = genOptLowercase.checked;
        const useNumber = genOptNumbers.checked;
        const useSymbol = genOptSymbols.checked;
        const excludeSimilar = genOptExcludeSimilar.checked;

        if (!useUpper && !useLower && !useNumber && !useSymbol) {
            genStrengthLabel.textContent = 'EMPTY';
            genStrengthLabel.style.color = 'var(--text-muted)';
            genStrengthBanner.style.borderLeftColor = 'var(--text-muted)';
            return;
        }

        // Estimate pool size (R)
        let R = 0;
        if (useLower) R += excludeSimilar ? 22 : 26; // minus i, l, o
        if (useUpper) R += excludeSimilar ? 22 : 26; // minus L, O, I
        if (useNumber) R += excludeSimilar ? 8 : 10;   // minus 0, 1
        if (useSymbol) R += excludeSimilar ? 27 : 29;  // minus |

        // Compute simulated entropy
        const entropy = length * Math.log2(R || 1);

        let strengthText = 'VERY WEAK';
        let labelColor = 'var(--text-strength-0)';
        let borderLeftColor = 'var(--strength-0)';

        if (entropy > 75 && length >= 12) {
            strengthText = 'VERY STRONG';
            labelColor = 'var(--text-strength-4)';
            borderLeftColor = 'var(--strength-4)';
        } else if (entropy > 55 && length >= 10) {
            strengthText = 'STRONG';
            labelColor = 'var(--text-strength-3)';
            borderLeftColor = 'var(--strength-3)';
        } else if (entropy > 35 && length >= 8) {
            strengthText = 'MEDIUM';
            labelColor = 'var(--text-strength-2)';
            borderLeftColor = 'var(--strength-2)';
        } else if (entropy > 20) {
            strengthText = 'WEAK';
            labelColor = 'var(--text-strength-1)';
            borderLeftColor = 'var(--strength-1)';
        }

        genStrengthLabel.textContent = `ESTIMATED: ${strengthText}`;
        genStrengthLabel.style.color = labelColor;
        genStrengthBanner.style.borderLeftColor = borderLeftColor;
    }

    // Copy Generated Key
    function copyGeneratedPassword() {
        const text = genPasswordDisplay.textContent;
        if (!text || genPasswordDisplay.classList.contains('placeholder')) {
            showToast("Nothing to copy!", "warning", "fa-solid fa-triangle-exclamation");
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showToast("Copied to clipboard!", "success", "fa-solid fa-circle-check");
            saveToHistory(text); // Log analysis to history on successful copy
        }).catch(err => {
            console.error('Clipboard error: ', err);
            showToast("Failed to copy", "warning", "fa-solid fa-triangle-exclamation");
        });
    }

    // --- SECURE HISTORY SYSTEM ---
    
    // Masking function (P@ssword123 -> P@ss*****23)
    function getMaskedPassword(pwd) {
        if (pwd.length <= 4) {
            return '*'.repeat(pwd.length);
        }
        const visibleStart = 3;
        const visibleEnd = Math.max(1, pwd.length - 8); // dynamic showing tail depending on length
        const start = pwd.slice(0, visibleStart);
        const end = pwd.slice(-visibleEnd);
        const masks = '*'.repeat(pwd.length - (visibleStart + visibleEnd));
        return `${start}${masks}${end}`;
    }

    // Adds analysis log to state and saves to Local Storage
    function saveToHistory(pwd) {
        if (!pwd || pwd.trim() === '') return;
        
        // Prevent duplicate consecutive entries in history
        if (state.history.length > 0 && state.history[0].raw === pwd) return;

        const analysis = analyzePasswordDetails(pwd);
        const newLog = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            raw: pwd, // temporarily kept in memory to avoid duplicating, stored in memory only
            masked: getMaskedPassword(pwd),
            score: analysis.score,
            strength: analysis.strength,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString()
        };

        state.history.unshift(newLog);

        // Limit history to top 30 logs for storage limits
        if (state.history.length > 30) {
            state.history.pop();
        }

        // Clean out raw passwords before saving to localStorage to maintain local security privacy
        const cleanHistory = state.history.map(item => ({
            id: item.id,
            masked: item.masked,
            score: item.score,
            strength: item.strength,
            timestamp: item.timestamp
        }));

        localStorage.setItem('cryptobox_history', JSON.stringify(cleanHistory));
        renderHistory();
    }

    function deleteHistoryItem(id) {
        state.history = state.history.filter(item => item.id !== id);
        
        const cleanHistory = state.history.map(item => ({
            id: item.id,
            masked: item.masked,
            score: item.score,
            strength: item.strength,
            timestamp: item.timestamp
        }));
        
        localStorage.setItem('cryptobox_history', JSON.stringify(cleanHistory));
        renderHistory();
        showToast("Log entry deleted", "info", "fa-solid fa-trash");
    }

    function clearHistory() {
        if (state.history.length === 0) {
            showToast("Log is already empty", "info", "fa-solid fa-inbox");
            return;
        }

        if (confirm("Are you sure you want to delete all password scans?")) {
            state.history = [];
            localStorage.removeItem('cryptobox_history');
            renderHistory();
            showToast("Log history cleared", "success", "fa-solid fa-trash-can");
        }
    }

    // Paint history logs into UI
    function renderHistory() {
        historyItemsContainer.innerHTML = '';

        if (state.history.length === 0) {
            historyItemsContainer.innerHTML = `
                <div class="history-empty">
                    <i class="fa-solid fa-inbox"></i>
                    <p>No password history recorded. Scan passwords on the Checker tab to save results.</p>
                </div>
            `;
            return;
        }

        state.history.forEach(item => {
            const row = document.createElement('div');
            row.className = 'history-item';

            // Get badge color
            let badgeStyle = 'background: rgba(239, 68, 68, 0.1); color: var(--text-strength-0); border: 1px solid rgba(239,68,68,0.2)';
            let fillStyle = 'background-color: var(--strength-0)';

            if (item.strength === 'WEAK') {
                badgeStyle = 'background: rgba(245, 158, 11, 0.1); color: var(--text-strength-1); border: 1px solid rgba(245,158,11,0.2)';
                fillStyle = 'background-color: var(--strength-1)';
            } else if (item.strength === 'MEDIUM') {
                badgeStyle = 'background: rgba(245, 158, 11, 0.15); color: var(--text-strength-2); border: 1px solid rgba(245,158,11,0.25)';
                fillStyle = 'background-color: var(--strength-2)';
            } else if (item.strength === 'STRONG') {
                badgeStyle = 'background: rgba(34, 197, 94, 0.1); color: var(--text-strength-3); border: 1px solid rgba(34,197,94,0.2)';
                fillStyle = 'background-color: var(--strength-3)';
            } else if (item.strength === 'VERY STRONG') {
                badgeStyle = 'background: rgba(0, 255, 196, 0.1); color: var(--text-strength-4); border: 1px solid rgba(0,255,196,0.2)';
                fillStyle = 'background-color: var(--strength-4)';
            }

            row.innerHTML = `
                <span class="history-pwd" title="Truncated for security">${item.masked}</span>
                <div class="history-score-wrapper">
                    <div class="history-score-bar">
                        <div class="history-score-fill" style="width: ${item.score}%; ${fillStyle}"></div>
                    </div>
                    <span class="history-score-num">${item.score}/100</span>
                </div>
                <span class="history-badge" style="${badgeStyle}">${item.strength}</span>
                <span class="history-time">${item.timestamp}</span>
                <div class="history-actions">
                    <button class="history-delete-btn" data-id="${item.id}" title="Remove entry" aria-label="Delete entry from history">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;

            // Delete specific button event
            row.querySelector('.history-delete-btn').addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-id');
                deleteHistoryItem(targetId);
            });

            historyItemsContainer.appendChild(row);
        });
    }

    // --- CYBER INTEL FACT ROTATOR ---
    function rotateFact() {
        rotatingFactContent.style.opacity = 0;
        
        setTimeout(() => {
            // Pick next or random fact
            state.factIndex = (state.factIndex + 1) % cybersecurityFacts.length;
            rotatingFactContent.textContent = cybersecurityFacts[state.factIndex];
            rotatingFactContent.style.opacity = 1;
        }, 250);
    }

    // --- SYSTEM TOAST NOTIFICATIONS ---
    function showToast(msg, type = 'success', iconClass = 'fa-solid fa-circle-check') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span class="toast-msg">${msg}</span>
        `;
        
        toastWrapper.appendChild(toast);
        
        // trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // cleanup
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3200);
    }

    // --- ACCESSIBILITY & HOTKEYS ---
    function handleKeyboardShortcuts(e) {
        // Ctrl + G -> Generate Password (if generator tab active, otherwise switches first)
        if (e.ctrlKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            if (state.activeTab !== 'generator') {
                const genTabBtn = document.getElementById('tab-generator');
                genTabBtn.click();
            }
            generatePassword();
        }

        // Ctrl + Shift + X -> Clear Input Fields
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            if (state.activeTab === 'checker') {
                mainPasswordInput.value = '';
                evaluatePassword('');
                showToast("Checker cleared", "info", "fa-solid fa-rotate-left");
            } else if (state.activeTab === 'generator') {
                genPasswordDisplay.textContent = 'Click Generate below...';
                genPasswordDisplay.classList.add('placeholder');
                updateGeneratorStrengthPreview();
                showToast("Generator cleared", "info", "fa-solid fa-rotate-left");
            }
        }

        // Esc -> Dismiss Warning Banners or active alerts
        if (e.key === 'Escape') {
            warningBanner.style.display = 'none';
        }
    }

    // Run Suite
    init();
});
