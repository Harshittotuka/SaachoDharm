// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const bhajansGrid = document.getElementById('bhajans-grid');
const bhajanSearch = document.getElementById('bhajan-search');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Global data storage
let allData = [];
let selectedCategory = null;

// Fetch JSON data from the server
async function fetchJainData() {
    try {
        const response = await fetch('/data/jainsaar_full_data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allData = await response.json();
        console.log('✓ Data loaded successfully:', allData.length, 'categories');
        
        // If on index page, load categories
        const pathname = window.location.pathname;
        const isIndexPage = pathname.includes('index.html') || pathname === '/' || pathname.endsWith('/');
        if (bhajansGrid && isIndexPage) {
            loadCategories();
            // initialize search on index after categories are loaded
            initSearch();
        }
        
        // If on bhajans page, check for category parameter
        if (window.location.pathname.includes('bhajans')) {
            const params = new URLSearchParams(window.location.search);
            selectedCategory = params.get('category');
            const catIndex = parseInt(params.get('cat') || '', 10);

            if (!selectedCategory && Number.isInteger(catIndex) && catIndex >= 0 && catIndex < allData.length) {
                selectedCategory = allData[catIndex].category;
            }

            if (selectedCategory) {
                selectedCategory = decodeURIComponent(selectedCategory);
                loadBhajansByCategory(selectedCategory);
            } else {
                loadAllBhajans();
            }
            // initialize search on bhajans page as well
            initSearch();
        }
    } catch (error) {
        console.error('✗ Error loading data:', error);
        if (bhajansGrid) {
            bhajansGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e74c3c;">Error loading content. Please refresh the page.</p>';
        }
    }
}

// Debounce helper
function debounce(fn, wait) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

// Search across all categories and bhajans (title + lyrics)
function searchAllBhajans(query) {
    if (!query || !allData || allData.length === 0) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results = [];
    allData.forEach(category => {
        category.items.forEach(item => {
            const title = (item.title || '').replace(/-/g, ' ').toLowerCase();
            const lyrics = (item.lyrics || '').toLowerCase();
            const eng = (item.english || item.en || item.en_lyrics || '').toLowerCase();

            if (title.includes(q) || lyrics.includes(q) || eng.includes(q)) {
                results.push({ category: category.category, item });
            }
        });
    });

    return results;
}

// Render search results into #bhajans-grid
function renderSearchResults(query, results) {
    if (!bhajansGrid) return;
    bhajansGrid.innerHTML = '';

    const header = document.createElement('div');
    header.style.gridColumn = '1/-1';
    header.style.marginBottom = '10px';
    header.innerHTML = `<h3 style="margin:0 0 8px 0;">Search results for "${escapeHtml(query)}" (${results.length})</h3>`;
    bhajansGrid.appendChild(header);

    if (results.length === 0) {
        const msg = document.createElement('p');
        msg.style.gridColumn = '1/-1';
        msg.style.textAlign = 'center';
        msg.textContent = 'No results found. Try a different keyword.';
        bhajansGrid.appendChild(msg);
        return;
    }

    results.forEach((res, index) => {
        const item = res.item;
        const titleDisplay = (item.title || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const preview = (item.lyrics || '').substring(0, 160).replace(/\n/g, ' ') + '...';

        const card = document.createElement('div');
        card.className = 'bhajan-card fade-in';
        card.style.animationDelay = `${index * 0.03}s`;
        card.innerHTML = `
            <h3>${escapeHtml(titleDisplay)}</h3>
            <p><strong>Category:</strong> ${escapeHtml(res.category)}</p>
            <p>${escapeHtml(preview)}</p>
            <div class="bhajan-meta">
                <a href="jain-bhajan-lyrics.html?bhajan_slug=${encodeURIComponent(item.title)}" class="btn btn-primary">
                    <span>View Lyrics</span>
                </a>
            </div>
        `;
        bhajansGrid.appendChild(card);
    });
}

function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Initialize search input behavior on index page
function initSearch() {
    const searchInput = document.getElementById('bhajan-search');
    if (!searchInput) return;

    const doSearch = debounce(function(e) {
        const q = searchInput.value || '';

        // Secret admin access
        if (q.trim().toLowerCase() === 'admin') {
            searchInput.value = '';
            // Overlay flash animation then open in new tab
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed', inset: '0', zIndex: '99999',
                background: 'radial-gradient(circle, rgba(99,102,241,.9) 0%, rgba(0,0,0,.95) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: '0', transition: 'opacity .35s ease'
            });
            overlay.innerHTML = '<div style="text-align:center;transform:scale(.7);transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .4s;opacity:0">' +
                '<i class="fas fa-shield-alt" style="font-size:3rem;color:#a5b4fc;margin-bottom:.5rem;display:block"></i>' +
                '<span style="color:#e0e7ff;font-size:1.25rem;font-weight:600;letter-spacing:1px">Opening Admin Panel…</span></div>';
            document.body.appendChild(overlay);
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                overlay.firstChild.style.opacity = '1';
                overlay.firstChild.style.transform = 'scale(1)';
            });
            setTimeout(() => {
                window.open('admin.html', '_blank');
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 400);
            }, 700);
            return;
        }

        const pathname = window.location.pathname;
        const isIndexPage = pathname.includes('index.html') || pathname === '/' || pathname.endsWith('/');
        const isBhajansPage = pathname.includes('bhajans');

        if (!q) {
            // no query -> restore default view depending on page
            if (isIndexPage) {
                loadCategories();
            } else if (isBhajansPage) {
                if (selectedCategory) loadBhajansByCategory(selectedCategory);
                else loadAllBhajans();
            }
            return;
        }

        // GLOBAL SEARCH: always search across all categories (even on bhajans page)
        const results = searchAllBhajans(q);
        renderSearchResults(q, results);
    }, 300);

    searchInput.addEventListener('input', doSearch);
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        }
    });
}

// Load categories on index page - displayed as clickable cards
function loadCategories() {
    if (!bhajansGrid) return;
    
    bhajansGrid.innerHTML = '';
    
    allData.forEach((categoryData, index) => {
        const card = document.createElement('div');
        card.className = 'bhajan-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Create category card with details
        card.innerHTML = `
            <h3>${categoryData.category}</h3>
           
            <div class="bhajan-meta">
                <span class="bhajan-duration">${categoryData.items.length} items</span>
                <a href="bhajans.html?cat=${index}" class="btn btn-primary">
                    <span>Explore</span>
                </a>
            </div>
        `;
        
        bhajansGrid.appendChild(card);
    });
}

// Load bhajans filtered by selected category
function loadBhajansByCategory(categoryName) {
    if (!bhajansGrid) return;
    
    const categoryData = allData.find(cat => cat.category === categoryName);
    if (!categoryData) {
        bhajansGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Category not found</p>';
        return;
    }
    
    // Update page title to show category name
    const pageTitle = document.querySelector('.page-hero h1');
    if (pageTitle) {
        pageTitle.textContent = categoryName;
    }
    
    bhajansGrid.innerHTML = '';
    
    // Create a card for each bhajan in the category
    categoryData.items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'bhajan-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Truncate lyrics preview
        const preview = item.lyrics.substring(0, 150).replace(/\n/g, ' ') + '...';
        const titleDisplay = item.title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        card.innerHTML = `
            <h3>${titleDisplay}</h3>
            <p>${preview}</p>
            <div class="bhajan-meta">
                <span class="bhajan-duration">View</span>
                                <a href="jain-bhajan-lyrics.html?bhajan_slug=${encodeURIComponent(item.title)}" 
                   class="btn btn-primary" target="_blank">
                    <span>View Lyrics</span>
                </a>
            </div>
        `;
        
        bhajansGrid.appendChild(card);
    });
}

// Load all bhajans from all categories
function loadAllBhajans() {
    if (!bhajansGrid) return;
    
    bhajansGrid.innerHTML = '';
    
    let itemIndex = 0;
    allData.forEach(categoryData => {
        categoryData.items.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'bhajan-card fade-in';
            card.style.animationDelay = `${(itemIndex % 12) * 0.05}s`;
            
            const preview = item.lyrics.substring(0, 120).replace(/\n/g, ' ') + '...';
            const titleDisplay = item.title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            card.innerHTML = `
                <h3>${titleDisplay}</h3>
                <p><strong>Category:</strong> ${categoryData.category}</p>
                <p>${preview}</p>
                <div class="bhajan-meta">
                    <span class="bhajan-duration">View</span>
                      <a href="jain-bhajan-lyrics.html?bhajan_slug=${encodeURIComponent(item.title)}" 
                       class="btn btn-primary" target="_blank">
                        <span>View Lyrics</span>
                    </a>
                </div>
            `;
            
            bhajansGrid.appendChild(card);
            itemIndex++;
        });
    });
}

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
    fetchJainData(); // Load JSON data first
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
