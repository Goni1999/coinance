// Coinance - Ultra-Modern Professional Trust Services Website JavaScript

// DOM Elements
const mobileMenuToggle = document.querySelector('#mobileMenuToggle');
const navMenu = document.querySelector('#navMenu');
const contactForm = document.getElementById('contactForm');
const ctaButtons = document.querySelectorAll('.btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const languageButtons = document.querySelectorAll('.lang-btn');

// Language system
let currentLanguage = 'en';
const translations = {};

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSystem();
    initializeEventListeners();
    initializeAnimations();
    initializeNewsFilter();
    initializeAnalytics();
    initializeModernFeatures();
});

// Modern Language System
function initializeLanguageSystem() {
    // Get browser language preference
    const browserLang = navigator.language.toLowerCase();
    const savedLang = localStorage.getItem('coinance-language');
    
    // Set initial language
    if (savedLang && ['en', 'de'].includes(savedLang)) {
        currentLanguage = savedLang;
    } else if (browserLang.startsWith('de')) {
        currentLanguage = 'de';
    } else {
        currentLanguage = 'en';
    }
    
    // Set document language
    document.documentElement.setAttribute('lang', currentLanguage);
    document.documentElement.setAttribute('data-lang', currentLanguage);
    
    // Update active language button
    updateLanguageButtons();
    
    // Apply language to all elements
    applyLanguage();
}

function switchLanguage(lang) {
    if (currentLanguage === lang) return;
    
    currentLanguage = lang;
    localStorage.setItem('coinance-language', lang);
    
    // Update document attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    
    // Update all translatable elements
    applyLanguage();
    
    // Update form placeholders
    updateFormPlaceholders();
    
    // Update active button
    updateLanguageButtons();
    
    // Track language change
    trackLanguageChange(lang);
    
    // Smooth transition effect
    document.body.style.opacity = '0.95';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 150);
}

function applyLanguage() {
    // Update all elements with data attributes
    document.querySelectorAll('[data-' + currentLanguage + ']').forEach(element => {
        const translatedText = element.getAttribute('data-' + currentLanguage);
        if (translatedText) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translatedText;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translatedText;
            } else {
                element.textContent = translatedText;
            }
        }
    });
    
    // Update meta tags
    const titleElement = document.querySelector('title');
    const descElement = document.querySelector('meta[name="description"]');
    
    if (titleElement && titleElement.getAttribute('data-' + currentLanguage)) {
        titleElement.textContent = titleElement.getAttribute('data-' + currentLanguage);
    }
    
    if (descElement && descElement.getAttribute('data-' + currentLanguage)) {
        descElement.setAttribute('content', descElement.getAttribute('data-' + currentLanguage));
    }
}

function updateFormPlaceholders() {
    document.querySelectorAll('input[data-placeholder-' + currentLanguage + '], textarea[data-placeholder-' + currentLanguage + ']').forEach(element => {
        const placeholder = element.getAttribute('data-placeholder-' + currentLanguage);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
}

function updateLanguageButtons() {
    languageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

// Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }

    // CTA button tracking
    ctaButtons.forEach(button => {
        button.addEventListener('click', trackCTAClick);
    });

    // Language selector buttons
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Service card hover tracking
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const serviceName = this.querySelector('h3').textContent;
            trackEvent('service_hover', { service: serviceName });
        });
    });

    // News link tracking
    document.querySelectorAll('.news-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const newsTitle = this.closest('.news-card').querySelector('h3').textContent;
            const newsCategory = this.closest('.news-card').querySelector('.news-category').textContent;
            trackEvent('news_click', { 
                title: newsTitle, 
                category: newsCategory 
            });
        });
    });

    // Advanced image lazy loading with intersection observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Window scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

// Modern Features Initialization
function initializeModernFeatures() {
    // Floating card animation
    const floatingCards = document.querySelectorAll('.floating-card, .about-badge');
    floatingCards.forEach(card => {
        card.style.animationDelay = Math.random() * 2 + 's';
    });

    // Parallax scrolling for hero elements
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleParallaxScroll);
    }

    // Modern cursor effects for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .service-card, .news-card, .value-item, .filter-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // Advanced typing effect for hero title (on larger screens)
    if (window.innerWidth > 768) {
        initializeTypingEffect();
    }
}

function handleParallaxScroll() {
    const scrolled = window.pageYOffset;
    
    // Hero image parallax
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        const rate = scrolled * -0.3;
        heroImg.style.transform = `translateY(${rate}px)`;
    }

    // Floating elements parallax
    const floatingElements = document.querySelectorAll('.floating-card, .about-badge, .banner-stats');
    floatingElements.forEach((element, index) => {
        const rate = scrolled * (0.1 + index * 0.05);
        element.style.transform += ` translateY(${-rate}px)`;
    });
}

function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const texts = {
        'en': 'Professional Trustee Services',
        'de': 'Professionelle Treuhänderdienstleistungen'
    };

    let isTyping = false;

    function typeText(text, element) {
        if (isTyping) return;
        isTyping = true;

        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = text;
            element.style.opacity = '1';
            isTyping = false;
        }, 300);
    }

    // Update title when language changes
    languageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setTimeout(() => {
                typeText(texts[lang], heroTitle);
            }, 200);
        });
    });
}

// News Filter Functionality
function initializeNewsFilter() {
    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter news cards with modern animation
            filterNewsCards(filter);
            
            // Track filter usage
            trackEvent('news_filter', { 
                filter: filter,
                language: currentLanguage 
            });
        });
    });
}

function filterNewsCards(filter) {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            // Staggered fade-in animation
            setTimeout(() => {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 100);
        } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
    
    // Prevent body scroll when menu is open
    if (!isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        smoothScrollTo(targetElement);
        trackCTAClick({ target: { textContent: 'Scroll to ' + sectionId } });
    }
}

function smoothScrollTo(element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed header
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Advanced Form Handling
function handleFormSubmission(e) {
    // Check if we're on Netlify (has data-netlify attribute)
    if (contactForm.hasAttribute('data-netlify')) {
        // Let Netlify handle the form submission natively
        // Just validate before submission
        const formData = new FormData(contactForm);
        const formObject = {};
        
        // Convert FormData to object for validation
        for (let [key, value] of formData.entries()) {
            if (key !== 'bot-field' && key !== 'form-name') {
                formObject[key] = value;
            }
        }
        
        // Validate form
        if (!validateForm(formObject)) {
            e.preventDefault(); // Stop submission if validation fails
            return;
        }
        
        // Add language info to form
        const hiddenLangField = document.createElement('input');
        hiddenLangField.type = 'hidden';
        hiddenLangField.name = 'language';
        hiddenLangField.value = currentLanguage;
        contactForm.appendChild(hiddenLangField);
        
        // If validation passes, let the form submit naturally to Netlify
        // Track the submission
        trackFormSubmission(formObject);
        return;
    }
    
    // For non-Netlify hosting (PHP backend)
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Validate form
    if (validateForm(formObject)) {
        submitForm(formObject);
    }
}

function validateForm(data) {
    const required = ['firstName', 'lastName', 'email', 'service'];
    const errors = [];
    
    // Get error messages in current language
    const errorMessages = {
        'en': {
            'firstName': 'First Name is required',
            'lastName': 'Last Name is required',
            'email': 'Email is required',
            'service': 'Service selection is required',
            'invalidEmail': 'Please enter a valid email address',
            'invalidPhone': 'Please enter a valid phone number'
        },
        'de': {
            'firstName': 'Vorname ist erforderlich',
            'lastName': 'Nachname ist erforderlich',
            'email': 'E-Mail ist erforderlich',
            'service': 'Service-Auswahl ist erforderlich',
            'invalidEmail': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            'invalidPhone': 'Bitte geben Sie eine gültige Telefonnummer ein'
        }
    };
    
    const messages = errorMessages[currentLanguage] || errorMessages['en'];
    
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(messages[field]);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push(messages.invalidEmail);
    }
    
    // Phone validation (optional but if provided, must be valid)
    if (data.phone && data.phone.trim() !== '' && !isValidPhone(data.phone)) {
        errors.push(messages.invalidPhone);
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFormErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Get error header in current language
    const errorHeaders = {
        'en': 'Please correct the following errors:',
        'de': 'Bitte korrigieren Sie die folgenden Fehler:'
    };
    
    const errorHeader = errorHeaders[currentLanguage] || errorHeaders['en'];
    
    // Create modern error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #dc2626;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        font-weight: 500;
        border: 1px solid #fecaca;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);
        backdrop-filter: blur(10px);
    `;
    
    errorContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <i class="fas fa-exclamation-triangle" style="color: #dc2626; font-size: 18px;"></i>
            <strong>${errorHeader}</strong>
        </div>
        <ul style="margin: 0; padding-left: 30px; line-height: 1.6;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    contactForm.insertBefore(errorContainer, contactForm.firstChild);
    
    // Smooth scroll to form
    smoothScrollTo(contactForm);
    
    // Modern shake animation
    errorContainer.style.animation = 'shake 0.5s ease-in-out';
}

function submitForm(data) {
    // Show modern loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    const loadingTexts = {
        'en': 'Sending...',
        'de': 'Wird gesendet...'
    };
    
    submitButton.textContent = loadingTexts[currentLanguage] || loadingTexts['en'];
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        showSuccessMessage();
        
        // Track conversion
        trackFormSubmission(data);
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        
    }, 2000);
}

function showSuccessMessage() {
    // Remove existing messages
    document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
    
    // Get success messages in current language
    const successMessages = {
        'en': {
            'title': 'Thank you for your inquiry!',
            'message': 'We\'ve received your message and a Coinance specialist will contact you within 24 hours to discuss your trust and fiduciary needs.'
        },
        'de': {
            'title': 'Vielen Dank für Ihre Anfrage!',
            'message': 'Wir haben Ihre Nachricht erhalten und ein Coinance-Spezialist wird Sie innerhalb von 24 Stunden kontaktieren, um Ihre Treuhand- und Treuhandbedürfnisse zu besprechen.'
        }
    };
    
    const messages = successMessages[currentLanguage] || successMessages['en'];
    
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message';
    successContainer.style.cssText = `
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        color: #166534;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 24px;
        font-weight: 500;
        text-align: center;
        border: 1px solid #bbf7d0;
        box-shadow: 0 4px 15px rgba(22, 101, 52, 0.1);
        backdrop-filter: blur(10px);
    `;
    
    successContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
            <i class="fas fa-check-circle" style="color: #22c55e; font-size: 24px;"></i>
            <strong style="font-size: 18px;">${messages.title}</strong>
        </div>
        <p style="margin: 0; line-height: 1.6; opacity: 0.9;">${messages.message}</p>
    `;
    
    contactForm.insertBefore(successContainer, contactForm.firstChild);
    smoothScrollTo(contactForm);
    
    // Modern celebration animation
    successContainer.style.animation = 'celebration 0.6s ease-out';
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        if (successContainer.parentNode) {
            successContainer.style.transition = 'all 0.5s ease-out';
            successContainer.style.opacity = '0';
            successContainer.style.transform = 'translateY(-20px)';
            setTimeout(() => successContainer.remove(), 500);
        }
    }, 10000);
}

// Advanced Animation Functions
function initializeAnimations() {
    // Advanced Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .value-item, .news-card').forEach(el => {
        observer.observe(el);
    });

    // Advanced parallax effect for hero elements
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero image parallax
            const heroImg = document.querySelector('.hero-img');
            if (heroImg) {
                const rate = scrolled * -0.5;
                heroImg.style.transform = `translateY(${rate}px)`;
            }
            
            // Floating elements subtle movement
            const floatingElements = document.querySelectorAll('.floating-card, .about-badge');
            floatingElements.forEach((element, index) => {
                const rate = scrolled * (0.1 + index * 0.02);
                element.style.transform += ` translateY(${-rate}px)`;
            });
        });
    }

    // Modern hover effects for interactive elements
    const hoverElements = document.querySelectorAll('.btn, .service-card, .news-card, .contact-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform += ' translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' translateY(-2px)', '');
        });
    });
}

// Scroll Event Handler
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Resize Event Handler
function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Reinitialize parallax for mobile
    if (window.innerWidth <= 768) {
        window.removeEventListener('scroll', handleParallaxScroll);
    } else {
        window.addEventListener('scroll', handleParallaxScroll);
    }
}

// Analytics and Tracking
function initializeAnalytics() {
    // Initialize Google Analytics if gtag is available
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID'); // Replace with actual GA ID
    }
    
    // Track page load with language info
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        industry: 'trust_services',
        company: 'coinance',
        language: currentLanguage,
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    });
}

function trackCTAClick(event) {
    const buttonText = event.target.textContent.trim();
    const buttonClass = event.target.className;
    
    trackEvent('cta_click', {
        button_text: buttonText,
        button_class: buttonClass,
        section: findParentSection(event.target),
        language: currentLanguage
    });
}

function trackLanguageChange(language) {
    const previousLanguage = currentLanguage === 'en' ? 'de' : 'en';
    
    trackEvent('language_change', {
        selected_language: language,
        previous_language: previousLanguage,
        available_languages: ['en', 'de'],
        method: 'button_click'
    });
}

function trackFormSubmission(formData) {
    trackEvent('form_submission', {
        form_type: 'contact_inquiry',
        service_interest: formData.service,
        company_provided: formData.company ? 'yes' : 'no',
        phone_provided: formData.phone ? 'yes' : 'no',
        inquiry_type: 'trust_services',
        lead_source: 'coinance_website',
        language: currentLanguage,
        form_completion_time: Date.now()
    });
}

function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, parameters);
    
    // You can add other analytics providers here
    // LinkedIn Insight Tag, Facebook Pixel, etc.
}

function findParentSection(element) {
    let parent = element.parentElement;
    while (parent) {
        if (parent.tagName === 'SECTION') {
            const className = parent.className;
            if (className.includes('trust-services')) return 'trust_services';
            if (className.includes('about')) return 'about';
            if (className.includes('news')) return 'news';
            if (className.includes('contact')) return 'contact';
            return className || parent.id || 'unknown_section';
        }
        parent = parent.parentElement;
    }
    return 'unknown_section';
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll and resize handlers
window.addEventListener('scroll', debounce(handleScroll, 10));
window.addEventListener('resize', debounce(handleResize, 250));

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Skip to main content with Tab
    if (e.key === 'Tab' && e.target === document.body) {
        const mainContent = document.querySelector('main') || document.querySelector('#services');
        if (mainContent) {
            mainContent.focus();
        }
    }
    
    // Language switching with keyboard shortcuts
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        const nextLang = currentLanguage === 'en' ? 'de' : 'en';
        switchLanguage(nextLang);
    }
});

// Trust Guide Download Functionality
function downloadTrustGuide() {
    // Track download intent with language info
    trackEvent('trust_guide_download', {
        source: 'hero_banner',
        guide_type: 'comprehensive',
        company: 'coinance',
        language: currentLanguage
    });
    
    // Get download message in current language
    const downloadMessages = {
        'en': 'Trust Guide download will be available soon. Please contact us for more information about our comprehensive trust services.',
        'de': 'Der Treuhand-Leitfaden zum Download wird bald verfügbar sein. Bitte kontaktieren Sie uns für weitere Informationen zu unseren umfassenden Treuhanddienstleistungen.'
    };
    
    const message = downloadMessages[currentLanguage] || downloadMessages['en'];
    
    // Modern alert replacement with styled modal
    showModernAlert(message);
}

function showModernAlert(message) {
    // Create modern modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modern-alert-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 16px;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        text-align: center;
        transform: translateY(-20px);
        animation: slideIn 0.3s ease-out 0.1s both;
    `;
    
    const closeTexts = {
        'en': 'Close',
        'de': 'Schließen'
    };
    
    modal.innerHTML = `
        <div style="color: var(--primary-blue); margin-bottom: 20px;">
            <i class="fas fa-download" style="font-size: 48px; opacity: 0.7;"></i>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: var(--gray-600); margin-bottom: 24px;">${message}</p>
        <button style="background: var(--primary-blue); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" onclick="this.closest('.modern-alert-overlay').remove()">${closeTexts[currentLanguage] || closeTexts['en']}</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Add download functionality to trust guide button
document.addEventListener('DOMContentLoaded', function() {
    const guideButton = document.querySelector('.service-banner .btn');
    if (guideButton) {
        guideButton.addEventListener('click', function(e) {
            e.preventDefault();
            downloadTrustGuide();
        });
    }
});

// Enhanced CSS for animations and modern effects
const coinanceUltraModernStyles = `
    /* Coinance Ultra-Modern website specific animations and effects */
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .service-card, .value-item, .news-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes celebration {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .hero-text-content {
        animation: slideInLeft 1s ease-out;
    }
    
    .hero-image {
        animation: slideInRight 1s ease-out 0.3s both;
    }
    
    /* Language transition effect */
    [data-en], [data-de] {
        transition: opacity 0.3s ease;
    }
    
    /* Advanced hover effects */
    .btn:hover {
        box-shadow: 0 8px 30px rgba(30, 58, 138, 0.3);
        transform: translateY(-3px);
    }
    
    .service-card:hover .service-icon {
        transform: rotate(5deg) scale(1.1);
        background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
        color: white;
    }
    
    .floating-card {
        cursor: pointer;
    }
    
    .floating-card:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 20px 40px rgba(30, 58, 138, 0.2);
    }
    
    /* Mobile menu animations */
    .nav-menu {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .nav-menu a {
        transition: all 0.3s ease;
        transform: translateY(20px);
        opacity: 0;
    }
    
    .nav-menu.active a {
        transform: translateY(0);
        opacity: 1;
        animation: slideInDown 0.5s ease-out forwards;
    }
    
    @keyframes slideInDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .mobile-menu-toggle {
        transition: all 0.3s ease;
    }
    
    .mobile-menu-toggle.active {
        transform: rotate(90deg);
        background: rgba(255, 255, 255, 0.2);
    }
    
    /* Enhanced focus states for accessibility */
    .btn:focus-visible,
    .lang-btn:focus-visible,
    .filter-btn:focus-visible {
        outline: 3px solid var(--accent-blue);
        outline-offset: 2px;
    }
    
    /* Enhanced mobile interactions */
    @media (max-width: 767px) {
        .nav-menu a:active,
        .btn:active,
        .service-card:active,
        .news-card:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
    }
    
    /* Modern scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--gray-100);
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--gray-400);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--gray-500);
    }
    
    /* Form enhancements */
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        transform: translateY(-1px);
        box-shadow: 0 4px 20px rgba(30, 58, 138, 0.1);
    }
    
    /* News badge hover effects */
    .news-badge:hover {
        transform: scale(1.1);
        background: var(--primary-blue);
    }
    
    .news-badge:hover i {
        color: white;
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = coinanceUltraModernStyles;
document.head.appendChild(styleSheet);

// Export functions for testing or external use
window.Coinance = {
    scrollToSection,
    trackEvent,
    toggleMobileMenu,
    downloadTrustGuide,
    filterNewsCards,
    switchLanguage,
    getCurrentLanguage: () => currentLanguage
}; 