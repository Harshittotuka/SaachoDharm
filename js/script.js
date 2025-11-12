// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const bhajansGrid = document.getElementById('bhajans-grid');
const tirthGrid = document.getElementById('tirth-grid');
const galleryGrid = document.getElementById('gallery-grid');
const bhajanSearch = document.getElementById('bhajan-search');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// (Bhajans and Tirth data moved into static HTML in their respective pages.)

// Sample data for gallery
const galleryData = [
    { id: 1, title: "Shri Shankheshwar Parshwanath Temple", icon: "🏛️" },
    { id: 2, title: "Dilwara Temple Architecture", icon: "🏛️" },
    { id: 3, title: "Palitana Temple Complex", icon: "🏛️" },
    { id: 4, title: "Ranakpur Temple Pillars", icon: "🏛️" },
    { id: 5, title: "Gommateshwara Statue", icon: "🗿" },
    { id: 6, title: "Girnar Mountain Temples", icon: "⛰️" },
    { id: 7, title: "Jain Monks in Meditation", icon: "🧘" },
    { id: 8, title: "Sacred Jain Scriptures", icon: "📜" },
    { id: 9, title: "Jain Festival Celebration", icon: "🎉" }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeGallery();
    initializeContactForm();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for internal section links only (not page redirects)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Only apply smooth scrolling to internal section links, not page redirects
        if (anchor.getAttribute('href') !== '#home') {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

// Scroll effects with throttling for better performance
function initializeScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar background change on scroll
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Optimized parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrollTop < window.innerHeight) {
            const parallax = scrollTop * 0.2; // Further reduced parallax intensity
            hero.style.transform = `translate3d(0, ${parallax}px, 0)`;
        } else if (hero) {
            // Reset transform when scrolled past hero section
            hero.style.transform = 'translate3d(0, 0, 0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Bhajans and Tirth Sthal cards have been moved to static HTML in their pages.

// Gallery functionality
function initializeGallery() {
    renderGallery(galleryData);
}

function renderGallery(galleryItems) {
    galleryGrid.innerHTML = '';
    
    galleryItems.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.style.animationDelay = `${index * 0.1}s`;
        galleryItem.innerHTML = `
            <div class="gallery-icon">${item.icon}</div>
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
            </div>
        `;
        galleryItem.addEventListener('click', () => openLightbox(item));
        galleryGrid.appendChild(galleryItem);
    });
}

function openLightbox(item) {
    lightboxImage.src = ''; // In a real implementation, you'd use actual images
    lightboxImage.alt = item.title;
    lightboxCaption.textContent = item.title;
    lightbox.classList.add('active');
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Initialize animations with optimized performance
function initializeAnimations() {
    // Intersection Observer for scroll animations with better performance
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Stop observing once animated to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation with staggered delay
    document.querySelectorAll('.bhajan-card, .tirth-card, .principle-card, .gallery-item').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add optimized animation styles
    const style = document.createElement('style');
    style.textContent = `
        .bhajan-card, .tirth-card, .principle-card, .gallery-item {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity, transform;
        }
        
        .bhajan-card.animate, .tirth-card.animate, .principle-card.animate, .gallery-item.animate {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
        
        .gallery-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            will-change: opacity;
        }
        
        .gallery-item:hover .gallery-overlay {
            opacity: 1;
        }
        
        .gallery-overlay h4 {
            color: white;
            text-align: center;
            font-size: 1.2rem;
        }
        
        .gallery-icon {
            font-size: 3rem;
        }
    `;
    document.head.appendChild(style);
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Add smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loading styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
