// Call Center Pro Landing Page JavaScript

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const ctaButtons = document.querySelectorAll('.btn');

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimations();
    initializeAnalytics();
});

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

    // Login button tracking
    document.querySelectorAll('a[href*="dashboard.coinance.co"]').forEach(loginButton => {
        loginButton.addEventListener('click', trackLoginClick);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Window scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
}

// Mobile Menu Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
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

// Form Handling
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
    const required = ['name', 'email', 'phone', 'company', 'service'];
    const errors = [];
    
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
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
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFormErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
        background: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-weight: 500;
    `;
    
    errorContainer.innerHTML = `
        <strong>Please correct the following errors:</strong>
        <ul style="margin: 10px 0 0 20px;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    contactForm.insertBefore(errorContainer, contactForm.firstChild);
    
    // Scroll to form
    smoothScrollTo(contactForm);
}

function submitForm(data) {
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
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
        
        // In a real implementation, you would send data to your backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).then(response => response.json()).then(result => {
        //     // Handle response
        // });
        
    }, 2000);
}

function showSuccessMessage() {
    // Remove existing messages
    document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
    
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message';
    successContainer.style.cssText = `
        background: #51cf66;
        color: white;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-weight: 500;
        text-align: center;
    `;
    
    successContainer.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 10px; font-size: 1.2em;"></i>
        <strong>Thank you for your interest!</strong><br>
        We've received your inquiry and will contact you within 24 hours.
    `;
    
    contactForm.insertBefore(successContainer, contactForm.firstChild);
    smoothScrollTo(contactForm);
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successContainer.remove();
    }, 10000);
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate statistics counters
                if (entry.target.classList.contains('feature-item')) {
                    animateStatNumbers(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature-item, .testimonial-card, .benefit-item').forEach(el => {
        observer.observe(el);
    });
}

function animateStatNumbers(element) {
    const statNumber = element.querySelector('.stat-number');
    if (statNumber && !statNumber.classList.contains('animated')) {
        statNumber.classList.add('animated');
        const finalNumber = statNumber.textContent;
        const isPercentage = finalNumber.includes('%');
        const number = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        if (!isNaN(number)) {
            animateNumber(statNumber, 0, number, isPercentage, finalNumber);
        }
    }
}

function animateNumber(element, start, end, isPercentage, originalText) {
    const duration = 2000;
    const steps = 60;
    const increment = (end - start) / steps;
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            const displayValue = Math.floor(current);
            element.textContent = isPercentage ? displayValue + '%' : 
                                 originalText.includes('+') ? displayValue + '+' :
                                 originalText.includes('/') ? displayValue + '/7' : displayValue;
        }
    }, duration / steps);
}

// Scroll Event Handler
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 102, 204, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
}

// Resize Event Handler
function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Analytics and Tracking
function initializeAnalytics() {
    // Initialize Google Analytics if gtag is available
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID'); // Replace with actual GA ID
    }
    
    // Track page load
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

function trackCTAClick(event) {
    const buttonText = event.target.textContent.trim();
    const buttonClass = event.target.className;
    
    trackEvent('cta_click', {
        button_text: buttonText,
        button_class: buttonClass,
        section: findParentSection(event.target)
    });
}

function trackLoginClick(event) {
    const buttonText = event.target.textContent.trim();
    const buttonLocation = findParentSection(event.target);
    
    trackEvent('login_access', {
        button_text: buttonText,
        location: buttonLocation,
        destination: 'dashboard.coinance.co',
        timestamp: new Date().toISOString()
    });
}

function trackFormSubmission(formData) {
    trackEvent('form_submission', {
        form_type: 'contact_form',
        service_interest: formData.service,
        company_size: estimateCompanySize(formData.company)
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
    // Facebook Pixel, LinkedIn Insight Tag, etc.
}

function findParentSection(element) {
    let parent = element.parentElement;
    while (parent) {
        if (parent.tagName === 'SECTION') {
            return parent.className || parent.id || 'unknown_section';
        }
        parent = parent.parentElement;
    }
    return 'unknown_section';
}

function estimateCompanySize(companyName) {
    // Simple heuristic to estimate company size
    const indicators = {
        startup: ['startup', 'inc', 'llc'],
        enterprise: ['corp', 'corporation', 'group', 'holdings', 'international']
    };
    
    const name = companyName.toLowerCase();
    
    for (let [size, keywords] of Object.entries(indicators)) {
        if (keywords.some(keyword => name.includes(keyword))) {
            return size;
        }
    }
    
    return 'unknown';
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
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Skip to main content with Tab
    if (e.key === 'Tab' && e.target === document.body) {
        const mainContent = document.querySelector('main') || document.querySelector('#intro');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// Add CSS for mobile menu animation
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            height: 100vh;
            background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: right 0.3s ease;
            z-index: 999;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu a {
            font-size: 1.2em;
            margin: 20px 0;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        
        .nav-menu a:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-menu .nav-login {
            background: rgba(255, 255, 255, 0.15) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            margin: 25px 0 !important;
            padding: 12px 24px !important;
            border-radius: 25px !important;
            font-weight: 600 !important;
        }
        
        .nav-menu .nav-login:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            border-color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .mobile-menu-toggle.active {
            transform: rotate(90deg);
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card, .feature-item, .testimonial-card, .benefit-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Export functions for testing or external use
window.Coinance = {
    scrollToSection,
    trackEvent,
    toggleMobileMenu
}; 