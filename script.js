// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Set minimum date for booking (today)
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', formattedDate);
});

// Service selection from service cards
function selectService(serviceName) {
    const serviceSelect = document.getElementById('service');
    serviceSelect.value = serviceName;
    
    // Scroll to booking section
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Add a visual highlight to the form
    const bookingForm = document.querySelector('.booking-form-container');
    bookingForm.style.transform = 'scale(1.02)';
    bookingForm.style.boxShadow = '0 25px 80px rgba(255, 107, 157, 0.2)';
    
    setTimeout(() => {
        bookingForm.style.transform = 'scale(1)';
        bookingForm.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
    }, 1000);
}

// Helper functions for navigation
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const bookingData = {};
    
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Validate required fields
    const requiredFields = ['clientName', 'phone', 'email', 'service', 'date', 'time', 'duration'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
    }
    
    // Validate phone number (South African format)
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/\s/g, ''))) {
        alert('Please enter a valid South African phone number (e.g., 0736538207 or +27736538207)');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Format date for display
    const bookingDate = new Date(bookingData.date);
    const formattedDate = bookingDate.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Format time for display
    const timeString = bookingData.time;
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = time.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Create WhatsApp message
    const message = `🌟 *Beauty Appointment Booking Request* 🌟

📝 *Client Details:*
👤 Name: ${bookingData.clientName}
📞 Phone: ${bookingData.phone}
📧 Email: ${bookingData.email}

💅 *Service Details:*
✨ Service: ${bookingData.service}
📅 Date: ${formattedDate}
⏰ Time: ${formattedTime}
⏱️ Duration: ${bookingData.duration}

${bookingData.notes ? `📋 *Additional Notes:*\n${bookingData.notes}\n\n` : ''}*Please confirm my appointment at your earliest convenience.*

Thank you! 💖

_Sent from Luxe Beauty Studio website_`;
    
    // Create WhatsApp URL
    const whatsappNumber = '27736538207'; // Your WhatsApp number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Show success modal
    showBookingModal();
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1500);
    
    // Reset form
    this.reset();
    
    // Track booking attempt (you can add analytics here)
    console.log('Booking submitted:', bookingData);
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const contactData = {};
    
    for (let [key, value] of formData.entries()) {
        contactData[key] = value;
    }
    
    // Create WhatsApp message for contact
    const message = `📞 *Contact Form Submission* 📞

👤 *From:* ${contactData.name}
📧 *Email:* ${contactData.email}
📝 *Subject:* ${contactData.subject}

💬 *Message:*
${contactData.message}

_Sent from Luxe Beauty Studio website_`;
    
    const whatsappNumber = '27736538207';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    this.reset();
});

// Modal functions
function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Intersection Observer for animation triggers
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .gallery-item, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-image');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Form validation and UX improvements
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value) {
            this.parentElement.classList.add('has-value');
        } else {
            this.parentElement.classList.remove('has-value');
        }
    });
});

// Service price updates based on selection
const servicePrices = {
    'Facial Treatment': 'From R350',
    'Lash Extensions': 'From R450',
    'Eyebrow Shaping': 'From R180',
    'Makeup Application': 'From R280',
    'Nail Care': 'From R220',
    'Skin Treatments': 'From R420'
};

document.getElementById('service').addEventListener('change', function() {
    const selectedService = this.value;
    if (selectedService && servicePrices[selectedService]) {
        // You can add a price display element here if needed
        console.log(`Selected service: ${selectedService} - ${servicePrices[selectedService]}`);
    }
});

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loading class to elements
    document.querySelectorAll('section').forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('loading');
        }, index * 100);
    });
});

// Smooth hover effects
document.querySelectorAll('.btn, .service-card, .gallery-item').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Image lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Social sharing functions (if needed)
function shareOnFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnWhatsApp() {
    const url = window.location.href;
    const text = 'Check out Luxe Beauty Studio for amazing beauty treatments!';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
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

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for failed image loads
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMiAxMkwyOCAyOE0yOCAxMkwxMiAyOCIgc3Ryb2tlPSIjQzVDNUM1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
        this.alt = 'Image not available';
    });
});

// Console welcome message
console.log(`
🌟 Luxe Beauty Studio Website 🌟
Built with modern web technologies
For bookings: 073 653 8207
© 2025 Professional Beauty Services
`);

// Analytics tracking (placeholder - replace with actual analytics)
function trackEvent(eventName, eventData) {
    console.log(`Analytics Event: ${eventName}`, eventData);
    // Add your analytics tracking code here (Google Analytics, etc.)
}

// Track form interactions
document.getElementById('bookingForm').addEventListener('submit', () => {
    trackEvent('booking_form_submitted', {
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
});

document.getElementById('contactForm').addEventListener('submit', () => {
    trackEvent('contact_form_submitted', {
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
});

// Service selection tracking
document.querySelectorAll('.service-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const serviceName = e.target.closest('.service-card').querySelector('h3').textContent;
        trackEvent('service_selected', {
            service: serviceName,
            timestamp: new Date().toISOString()
        });
    });
});

// WhatsApp button tracking
document.querySelector('.whatsapp-link').addEventListener('click', () => {
    trackEvent('whatsapp_clicked', {
        timestamp: new Date().toISOString(),
        type: 'float_button'
    });
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Luxe Beauty Studio website loaded successfully! 🌟');
    
    // Add any additional initialization code here
    
    // Set up automatic form field focusing
    const firstInput = document.querySelector('#bookingForm input');
    if (firstInput) {
        firstInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
    }
    
    // Add smooth transitions to all interactive elements
    document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
});

// Easter egg - Konami code for fun
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        console.log('🎉 Beauty mode activated! 🎉');
    }
});
