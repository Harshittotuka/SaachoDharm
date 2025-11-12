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

// Sample data for bhajans
const bhajansData = [
    {
        id: 1,
        title: "Namokar Mantra",
        description: "The most sacred mantra in Jainism, paying homage to the five supreme beings.",
        duration: "2:30",
        lyrics: `Namo Arihantānam
Namo Siddhānam
Namo Āyariyānam
Namo Uvajjhāyānam
Namo Loe Savva Sahūnam
Eso Panch Namokkāro
Savva Pāvappanāsano
Mangalānam Cha Savvesim
Padhamam Havai Mangalam`
    },
    {
        id: 2,
        title: "Bhaktāmara Stotra",
        description: "A devotional hymn composed by Acharya Manatunga, praising Lord Adinatha.",
        duration: "5:45",
        lyrics: `Jai Jinendra! Jai Jinendra!
Bhaktāmara Stotra
Acharya Manatunga virachit
Adinatha ki stuti
Jai Jinendra! Jai Jinendra!`
    },
    {
        id: 3,
        title: "Uvasaggaharam Stotra",
        description: "A powerful stotra for removing obstacles and achieving success.",
        duration: "4:20",
        lyrics: `Uvasaggaharam Pāsaṃ
Jassa Dukkhaṃ Vināsai
Hantavvaṃ Uttamaṃ Loke
Viṇṇu Kappāṇi Jīvāṇi`
    },
    {
        id: 4,
        title: "Santikaram Stotra",
        description: "A peaceful hymn for inner tranquility and spiritual growth.",
        duration: "3:15",
        lyrics: `Santikaram Stotra
Acharya Manatunga virachit
Shanti aur shakti ka stotra
Jai Jinendra! Jai Jinendra!`
    },
    {
        id: 5,
        title: "Kalyāṇamandira Stotra",
        description: "A beautiful hymn praising the temple of enlightenment.",
        duration: "6:10",
        lyrics: `Kalyāṇamandira Stotra
Mandira ki stuti
Jain Dharma ki mahima
Jai Jinendra! Jai Jinendra!`
    },
    {
        id: 6,
        title: "Tijayapahutta Stotra",
        description: "A protective stotra for overcoming fears and obstacles.",
        duration: "4:50",
        lyrics: `Tijayapahutta Stotra
Raksha aur shakti ka stotra
Jai Jinendra! Jai Jinendra!`
    }
];

// Sample data for Tirth Sthals
const tirthData = [
    {
        id: 1,
        name: "Shri Shankheshwar Parshwanath",
        location: "Shankheshwar, Gujarat",
        description: "One of the most sacred Jain temples, known for its magnificent architecture and spiritual significance.",
        history: "Built in the 12th century, this temple is dedicated to Lord Parshwanath and is considered one of the most important pilgrimage sites in Jainism.",
        rituals: "Daily aarti, abhishek, and special prayers during festivals",
        prasadh: "Traditional Jain sweets and fruits offered to devotees"
    },
    {
        id: 2,
        name: "Shri Dilwara Temples",
        location: "Mount Abu, Rajasthan",
        description: "Famous for their intricate marble carvings and architectural beauty, these temples are a marvel of Jain art.",
        history: "Constructed between the 11th and 13th centuries, these temples showcase the finest examples of Jain temple architecture.",
        rituals: "Morning and evening prayers, special ceremonies during Paryushan",
        prasadh: "Sacred water and traditional Jain prasadh"
    },
    {
        id: 3,
        name: "Shri Palitana Temples",
        location: "Palitana, Gujarat",
        description: "A cluster of over 800 temples on Shatrunjaya Hill, considered the most sacred pilgrimage site for Jains.",
        history: "The temples were built over several centuries, with the first temple dating back to the 11th century.",
        rituals: "Climbing the hill barefoot, offering prayers at each temple",
        prasadh: "Blessed water and traditional Jain offerings"
    },
    {
        id: 4,
        name: "Shri Ranakpur Jain Temple",
        location: "Ranakpur, Rajasthan",
        description: "Famous for its 1444 intricately carved marble pillars, each unique in design.",
        history: "Built in the 15th century, this temple is dedicated to Lord Adinatha and is a masterpiece of Jain architecture.",
        rituals: "Daily prayers, meditation sessions, and special festivals",
        prasadh: "Sacred water and traditional Jain sweets"
    },
    {
        id: 5,
        name: "Shri Shravanabelagola",
        location: "Shravanabelagola, Karnataka",
        description: "Home to the famous 57-foot tall statue of Lord Gommateshwara, carved from a single rock.",
        history: "The statue was commissioned by Chavundaraya in 981 AD and is one of the largest monolithic statues in the world.",
        rituals: "Mahamastakabhisheka ceremony every 12 years, daily prayers",
        prasadh: "Blessed water and traditional South Indian Jain prasadh"
    },
    {
        id: 6,
        name: "Shri Girnar Temples",
        location: "Junagadh, Gujarat",
        description: "A sacred mountain with numerous Jain temples, including the famous Neminath temple.",
        history: "The temples date back to the 12th century and are built on the sacred Girnar mountain.",
        rituals: "Mountain climbing, temple visits, and special prayers",
        prasadh: "Sacred water and traditional Gujarati Jain prasadh"
    }
];

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
    initializeBhajans();
    initializeTirthSthals();
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

// Bhajans functionality
function initializeBhajans() {
    renderBhajans(bhajansData);
    
    // Search functionality
    bhajanSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredBhajans = bhajansData.filter(bhajan => 
            bhajan.title.toLowerCase().includes(searchTerm) ||
            bhajan.description.toLowerCase().includes(searchTerm)
        );
        renderBhajans(filteredBhajans);
    });
}

function renderBhajans(bhajans) {
    bhajansGrid.innerHTML = '';
    
    bhajans.forEach((bhajan, index) => {
        const bhajanCard = document.createElement('div');
        bhajanCard.className = 'bhajan-card fade-in';
        bhajanCard.style.animationDelay = `${index * 0.1}s`;
        bhajanCard.innerHTML = `
            <h3>${bhajan.title}</h3>
            <p>${bhajan.description}</p>
            <div class="bhajan-meta">
                <span class="bhajan-duration">${bhajan.duration}</span>
                <button class="btn btn-primary" onclick="openBhajanModal(${bhajan.id})">View Lyrics</button>
            </div>
        `;
        bhajansGrid.appendChild(bhajanCard);
    });
}

function openBhajanModal(bhajanId) {
    const bhajan = bhajansData.find(b => b.id === bhajanId);
    if (bhajan) {
        // Create modal for bhajan lyrics
        const modal = document.createElement('div');
        modal.className = 'bhajan-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${bhajan.title}</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <p class="bhajan-description">${bhajan.description}</p>
                    <div class="bhajan-lyrics">
                        <h4>Lyrics:</h4>
                        <pre>${bhajan.lyrics}</pre>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeBhajanModal()">Close</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .bhajan-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: zoomIn 0.3s ease;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            .modal-close {
                font-size: 2rem;
                cursor: pointer;
                color: #999;
            }
            .modal-body {
                padding: 20px;
            }
            .bhajan-lyrics pre {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                white-space: pre-wrap;
                font-family: 'Merriweather', serif;
                line-height: 1.6;
            }
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', closeBhajanModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBhajanModal();
            }
        });
    }
}

function closeBhajanModal() {
    const modal = document.querySelector('.bhajan-modal');
    if (modal) {
        modal.remove();
    }
}

// Tirth Sthals functionality
function initializeTirthSthals() {
    renderTirthSthals(tirthData);
}

function renderTirthSthals(tirths) {
    tirthGrid.innerHTML = '';
    
    tirths.forEach((tirth, index) => {
        const tirthCard = document.createElement('div');
        tirthCard.className = 'tirth-card fade-in';
        tirthCard.style.animationDelay = `${index * 0.1}s`;
        tirthCard.innerHTML = `
            <div class="tirth-image">
                <i class="fas fa-temple-hindu"></i>
            </div>
            <div class="tirth-content">
                <h3>${tirth.name}</h3>
                <p>${tirth.description}</p>
                <div class="tirth-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${tirth.location}</span>
                </div>
                <button class="btn btn-primary" onclick="openTirthModal(${tirth.id})" style="margin-top: 15px; width: 100%;">View Details</button>
            </div>
        `;
        tirthGrid.appendChild(tirthCard);
    });
}

function openTirthModal(tirthId) {
    const tirth = tirthData.find(t => t.id === tirthId);
    if (tirth) {
        const modal = document.createElement('div');
        modal.className = 'tirth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${tirth.name}</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="tirth-details">
                        <div class="detail-section">
                            <h4>Location</h4>
                            <p>${tirth.location}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Description</h4>
                            <p>${tirth.description}</p>
                        </div>
                        <div class="detail-section">
                            <h4>History</h4>
                            <p>${tirth.history}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Rituals</h4>
                            <p>${tirth.rituals}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Prasadh</h4>
                            <p>${tirth.prasadh}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeTirthModal()">Close</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .tirth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            }
            .tirth-details .detail-section {
                margin-bottom: 20px;
            }
            .tirth-details h4 {
                color: var(--saffron);
                margin-bottom: 10px;
            }
            .tirth-details p {
                line-height: 1.6;
                color: #666;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', closeTirthModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTirthModal();
            }
        });
    }
}

function closeTirthModal() {
    const modal = document.querySelector('.tirth-modal');
    if (modal) {
        modal.remove();
    }
}

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
        closeBhajanModal();
        closeTirthModal();
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
