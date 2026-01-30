/**
 * Nuora Feminine Balance Quiz Funnel
 * Handles quiz navigation, conditional routing, and analytics
 */

(function() {
    'use strict';

    // Quiz State
    const state = {
        currentStep: 1,
        totalSteps: 15,
        answers: {},
        email: null,
        offerType: 'gummies', // 'gummies' or 'bundle'
        triedProbiotics: false
    };

    // DOM Elements
    const elements = {
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
        backBtn: document.getElementById('backBtn'),
        analysisFill: document.getElementById('analysisFill'),
        analysisPercent: document.getElementById('analysisPercent'),
        emailForm: document.getElementById('emailForm'),
        emailInput: document.getElementById('emailInput'),
        skipEmail: document.getElementById('skipEmail'),
        resultsGummies: document.getElementById('resultsGummies'),
        resultsBundle: document.getElementById('resultsBundle'),
        finalGummies: document.getElementById('finalGummies'),
        finalBundle: document.getElementById('finalBundle'),
        probioticsFailed: document.getElementById('probioticsFailed')
    };

    // Initialize Quiz
    function init() {
        bindEvents();
        updateProgress();
        updateBackButton();
    }

    // Bind Event Listeners
    function bindEvents() {
        // Single-select options
        document.querySelectorAll('.single-select .option-card').forEach(card => {
            card.addEventListener('click', handleSingleSelect);
        });

        // Multi-select options
        document.querySelectorAll('.multi-select .option-card').forEach(card => {
            card.addEventListener('click', handleMultiSelect);
        });

        // Continue buttons
        document.getElementById('step3Continue')?.addEventListener('click', () => goToStep(4));
        document.getElementById('step12Continue')?.addEventListener('click', () => goToStep(13));
        document.getElementById('step13Continue')?.addEventListener('click', () => goToStep(14));
        document.getElementById('step14Continue')?.addEventListener('click', () => goToStep(15));

        // Email form
        elements.emailForm?.addEventListener('submit', handleEmailSubmit);
        elements.skipEmail?.addEventListener('click', () => goToStep(10));

        // Back button
        elements.backBtn?.addEventListener('click', goBack);
    }

    // Handle Single Select
    function handleSingleSelect(e) {
        const card = e.currentTarget;
        const step = parseInt(card.closest('.quiz-step').dataset.step);
        const value = card.dataset.value;
        const route = card.dataset.route;

        // Deselect siblings
        card.closest('.options-grid').querySelectorAll('.option-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Select this one
        card.classList.add('selected');

        // Save answer
        state.answers[`step${step}`] = value;

        // Handle routing for step 5 (gut issues)
        if (step === 5 && route) {
            state.offerType = route;
        }

        // Auto-advance after short delay
        setTimeout(() => {
            goToStep(step + 1);
        }, 300);
    }

    // Handle Multi Select
    function handleMultiSelect(e) {
        const card = e.currentTarget;
        card.classList.toggle('selected');

        const step = parseInt(card.closest('.quiz-step').dataset.step);
        const selected = Array.from(card.closest('.options-grid').querySelectorAll('.option-card.selected'))
            .map(c => c.dataset.value);

        state.answers[`step${step}`] = selected;

        // Check if probiotics were selected (for step 13 conditional content)
        if (step === 3 && selected.includes('probiotics')) {
            state.triedProbiotics = true;
        }
    }

    // Handle Email Submit
    function handleEmailSubmit(e) {
        e.preventDefault();
        const email = elements.emailInput?.value?.trim();

        if (email && isValidEmail(email)) {
            state.email = email;
            trackEvent('email_captured', { email });
            goToStep(10);
        } else {
            elements.emailInput?.classList.add('error');
            setTimeout(() => elements.emailInput?.classList.remove('error'), 2000);
        }
    }

    // Validate Email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Go to Step
    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > state.totalSteps) return;

        // Hide current step
        document.querySelector('.quiz-step.active')?.classList.remove('active');

        // Show new step
        const newStep = document.querySelector(`.quiz-step[data-step="${stepNumber}"]`);
        newStep?.classList.add('active');

        state.currentStep = stepNumber;
        updateProgress();
        updateBackButton();

        // Handle special steps
        if (stepNumber === 10) {
            runAnalysisAnimation();
        }

        if (stepNumber === 11) {
            showResults();
        }

        if (stepNumber === 13) {
            showProbioticsSection();
        }

        if (stepNumber === 15) {
            showFinalOffer();
        }

        // Track step view
        trackEvent('step_view', { step: stepNumber });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Go Back
    function goBack() {
        if (state.currentStep > 1) {
            goToStep(state.currentStep - 1);
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const progress = (state.currentStep / state.totalSteps) * 100;
        if (elements.progressFill) {
            elements.progressFill.style.width = `${progress}%`;
        }
        if (elements.progressText) {
            elements.progressText.textContent = `Step ${state.currentStep} of ${state.totalSteps}`;
        }
    }

    // Update Back Button Visibility
    function updateBackButton() {
        if (elements.backBtn) {
            if (state.currentStep <= 1 || state.currentStep === 10) {
                elements.backBtn.classList.add('hidden');
            } else {
                elements.backBtn.classList.remove('hidden');
            }
        }
    }

    // Run Analysis Animation
    function runAnalysisAnimation() {
        const duration = 8000; // 8 seconds
        const steps = 4;
        const stepDuration = duration / steps;
        let progress = 0;

        // Reset
        if (elements.analysisFill) elements.analysisFill.style.width = '0%';
        if (elements.analysisPercent) elements.analysisPercent.textContent = '0%';

        document.querySelectorAll('.analysis-item').forEach(item => {
            item.classList.remove('active', 'complete');
        });

        // Animate progress
        const progressInterval = setInterval(() => {
            progress += 2;
            if (elements.analysisFill) elements.analysisFill.style.width = `${progress}%`;
            if (elements.analysisPercent) elements.analysisPercent.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(progressInterval);
                // Auto-advance to results after completion
                setTimeout(() => goToStep(11), 500);
            }
        }, duration / 50);

        // Animate steps
        for (let i = 1; i <= steps; i++) {
            setTimeout(() => {
                const item = document.querySelector(`.analysis-item[data-analysis="${i}"]`);
                if (item) {
                    item.classList.add('active');
                    setTimeout(() => {
                        item.classList.remove('active');
                        item.classList.add('complete');
                    }, stepDuration - 200);
                }
            }, (i - 1) * stepDuration);
        }
    }

    // Show Results Based on Offer Type
    function showResults() {
        if (state.offerType === 'bundle') {
            elements.resultsGummies?.classList.add('hidden');
            elements.resultsBundle?.classList.remove('hidden');
        } else {
            elements.resultsGummies?.classList.remove('hidden');
            elements.resultsBundle?.classList.add('hidden');
        }

        // Track which offer was shown
        trackEvent('results_shown', { offer_type: state.offerType });
    }

    // Show Probiotics Failed Section (if they tried probiotics)
    function showProbioticsSection() {
        if (state.triedProbiotics && elements.probioticsFailed) {
            elements.probioticsFailed.classList.remove('hidden');
        }
    }

    // Show Final Offer
    function showFinalOffer() {
        if (state.offerType === 'bundle') {
            elements.finalGummies?.classList.add('hidden');
            elements.finalBundle?.classList.remove('hidden');
        } else {
            elements.finalGummies?.classList.remove('hidden');
            elements.finalBundle?.classList.add('hidden');
        }
    }

    // Track Event (placeholder for analytics)
    function trackEvent(eventName, data) {
        console.log('Track:', eventName, data);

        // Send to Klaviyo if available
        if (window._learnq) {
            window._learnq.push(['track', eventName, data]);
        }

        // Send to Meta Pixel if available
        if (window.fbq) {
            if (eventName === 'results_shown') {
                window.fbq('track', 'ViewContent', {
                    content_name: data.offer_type === 'bundle' ? 'Complete Balance Bundle' : 'Feminine Balance Gummies',
                    content_category: 'Quiz Result'
                });
            }
        }

        // Send to Google Analytics if available
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.NuoraQuiz = {
        state,
        goToStep,
        trackEvent
    };

})();
