/* =========================================
   TIRTH STHAL — Detail Page JS
   Loads single item, gallery, comments (localStorage)
   ========================================= */

(function () {
    'use strict';

    let currentTirth = null;
    let allTirths = [];
    let currentLightboxIndex = 0;
    let selectedRating = 0;
    const FALLBACK_TEMPLE_IMAGE = 'img/temple_alt.png';

    // DOM
    const heroImg = document.getElementById('td-hero-img');
    const heroTitle = document.getElementById('td-hero-title');
    const heroHindi = document.getElementById('td-hero-hindi');
    const heroBadges = document.getElementById('td-hero-badges');
    const heroLocation = document.getElementById('td-hero-location');
    const description = document.getElementById('td-description');
    const highlightsList = document.getElementById('td-highlights-list');
    const galleryGrid = document.getElementById('td-gallery-grid');
    const infoList = document.getElementById('td-info-list');
    const mapEl = document.getElementById('td-map');
    const directionsBtn = document.getElementById('td-directions-btn');
    const howToReach = document.getElementById('td-how-to-reach');
    const commentsListEl = document.getElementById('td-comments-list');

    // Lightbox
    const lightbox = document.getElementById('td-lightbox');
    const lightboxImg = document.getElementById('td-lightbox-img');
    const lightboxClose = document.getElementById('td-lightbox-close');
    const lightboxPrev = document.getElementById('td-lightbox-prev');
    const lightboxNext = document.getElementById('td-lightbox-next');
    const lightboxCounter = document.getElementById('td-lightbox-counter');

    // Comments
    const commentName = document.getElementById('td-comment-name');
    const commentText = document.getElementById('td-comment-text');
    const commentSubmit = document.getElementById('td-comment-submit');
    const ratingInput = document.getElementById('td-rating-input');

    // Share
    const shareWhatsapp = document.getElementById('td-share-whatsapp');
    const shareTwitter = document.getElementById('td-share-twitter');
    const shareFacebook = document.getElementById('td-share-facebook');
    const shareCopy = document.getElementById('td-share-copy');

    // ---- Init ----
    async function init() {
        const params = new URLSearchParams(window.location.search);
        const pathMatch = window.location.pathname.match(/^\/tirth\/([^/]+)\/?$/i);
        const pathId = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
        const id = pathId || params.get('id');
        if (!id) {
            window.location.href = 'tirth-sthal';
            return;
        }

        try {
            const res = await fetch('data/tirth_sthal_data.json');
            if (!res.ok) throw new Error('Failed to load data');
            allTirths = await res.json();
            currentTirth = allTirths.find(t => t.id === id);

            if (!currentTirth) {
                window.location.href = 'tirth-sthal';
                return;
            }

            render();
            setupLightbox();
            setupComments();
            setupRating();
            setupShare();
            updatePageMeta();
        } catch (err) {
            console.error('Error loading detail:', err);
        }
    }

    // ---- Render all sections ----
    function render() {
        const t = currentTirth;

        // Hero image
        const displayImages = getDisplayImages();
        heroImg.style.backgroundImage = `url('${displayImages[0]}')`;

        // Title & Hindi name
        heroTitle.textContent = t.name;
        heroHindi.textContent = t.nameHindi || '';

        // Location
        const locSpan = heroLocation.querySelector('span');
        if (locSpan) locSpan.textContent = t.location;

        // Badges
        heroBadges.innerHTML = '';
        if (t.type) {
            heroBadges.innerHTML += `<span class="ts-badge ts-badge-type">${esc(t.type)}</span>`;
        }
        if (t.category && t.category !== '—') {
            heroBadges.innerHTML += `<span class="ts-badge ts-badge-category">${esc(t.category)}</span>`;
        }
        if (t.significance && t.significance !== 'Dharamshala') {
            heroBadges.innerHTML += `<span class="ts-badge ts-badge-significance">${esc(t.significance)}</span>`;
        }
        if (t.featured) {
            heroBadges.innerHTML += `<span class="ts-badge ts-badge-featured">Featured</span>`;
        }
        if (t.hasDharamshala) {
            heroBadges.innerHTML += `<span class="ts-badge ts-badge-dharamshala"><i class="fas fa-bed"></i> Dharamshala Available</span>`;
        }

        // Description
        description.textContent = t.description;

        // Highlights
        highlightsList.innerHTML = '';
        (t.highlights || []).forEach(h => {
            const li = document.createElement('li');
            li.textContent = h;
            highlightsList.appendChild(li);
        });

        // Gallery
        renderGallery();

        // Quick Info sidebar
        renderInfo();

        // Map
        renderMap();

        // How to reach
        if (howToReach) howToReach.textContent = t.howToReach || '';

        // Directions
        if (directionsBtn) {
            const destQuery = encodeURIComponent(t.name + ', ' + t.location);
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destQuery}&travelmode=driving`;
            directionsBtn.href = directionsUrl;
            directionsBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.open(directionsUrl, '_blank', 'noopener');
            });
        }
    }

    // ---- Gallery ----
    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        const images = getDisplayImages();

        images.forEach((img, idx) => {
            const item = document.createElement('div');
            item.className = 'td-gallery-item';
            item.innerHTML = `<img src="${esc(img)}" alt="${esc(currentTirth.name)} - Photo ${idx + 1}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_TEMPLE_IMAGE}'">`;
            item.addEventListener('click', () => openLightbox(idx));
            galleryGrid.appendChild(item);
        });
    }

    function getDisplayImages() {
        const images = currentTirth?.images || [];
        return images.length > 0 ? images : [FALLBACK_TEMPLE_IMAGE];
    }

    // ---- Quick Info ----
    function renderInfo() {
        if (!infoList) return;
        const t = currentTirth;
        const items = [
            { icon: 'fas fa-om', label: 'Type', value: t.type },
            { icon: 'fas fa-gopuram', label: 'Deity', value: (t.deity && t.deity !== '—') ? t.deity : '' },
            { icon: 'fas fa-tag', label: 'Category', value: t.category },
            { icon: 'fas fa-star', label: 'Significance', value: (t.significance && t.significance !== 'Dharamshala') ? t.significance : '' },
            { icon: 'fas fa-clock', label: 'Timings', value: t.timings },
            { icon: 'fas fa-calendar-alt', label: 'Best Time', value: t.bestTimeToVisit },
            { icon: 'fas fa-map-marker-alt', label: 'State', value: t.state },
            { icon: 'fas fa-bed', label: 'Dharamshala', value: t.hasDharamshala ? (t.dharamshalaInfo || 'Available') : '' }
        ];

        infoList.innerHTML = items
            .filter(i => i.value)
            .map(i => `
                <div class="td-info-item">
                    <i class="${i.icon}"></i>
                    <div>
                        <div class="td-info-label">${esc(i.label)}</div>
                        <div class="td-info-value">${esc(i.value)}</div>
                    </div>
                </div>
            `).join('');
    }

    // ---- Map ----
    function renderMap() {
        if (!mapEl || !currentTirth.coordinates) return;
        const { lat, lng } = currentTirth.coordinates;
        const q = encodeURIComponent(currentTirth.name + ', ' + currentTirth.location);
        mapEl.innerHTML = `<iframe
            src="https://www.google.com/maps?q=${q}&z=14&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map of ${esc(currentTirth.name)}"
            style="border:0;"
            allowfullscreen></iframe>`;
    }

    // ---- Lightbox ----
    function setupLightbox() {
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        }
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!lightbox?.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    function openLightbox(idx) {
        const images = getDisplayImages();
        if (images.length === 0) return;
        currentLightboxIndex = idx;
        lightboxImg.src = images[idx];
        lightboxImg.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_TEMPLE_IMAGE;
        };
        lightboxCounter.textContent = `${idx + 1} / ${images.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        const images = getDisplayImages();
        currentLightboxIndex = (currentLightboxIndex + dir + images.length) % images.length;
        lightboxImg.src = images[currentLightboxIndex];
        lightboxImg.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_TEMPLE_IMAGE;
        };
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
    }

    // ---- Comments (localStorage) ----
    function getCommentsKey() {
        return `ts_comments_${currentTirth.id}`;
    }

    function loadComments() {
        try {
            return JSON.parse(localStorage.getItem(getCommentsKey())) || [];
        } catch { return []; }
    }

    function saveComments(comments) {
        localStorage.setItem(getCommentsKey(), JSON.stringify(comments));
    }

    function renderComments() {
        if (!commentsListEl) return;
        const comments = loadComments();

        if (comments.length === 0) {
            commentsListEl.innerHTML = `
                <div class="td-comments-empty">
                    <i class="far fa-comment-dots"></i>
                    <p>No comments yet. Be the first to share your experience!</p>
                </div>`;
            return;
        }

        commentsListEl.innerHTML = comments.map(c => {
            const initial = (c.name || 'A').charAt(0).toUpperCase();
            const stars = '★'.repeat(c.rating || 0) + '☆'.repeat(5 - (c.rating || 0));
            const date = c.date ? new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
            return `
                <div class="td-comment-item">
                    <div class="td-comment-avatar">${initial}</div>
                    <div class="td-comment-body">
                        <div class="td-comment-header">
                            <span class="td-comment-name">${esc(c.name)}</span>
                            <span class="td-comment-stars">${stars}</span>
                            <span class="td-comment-date">${date}</span>
                        </div>
                        <p class="td-comment-text">${esc(c.text)}</p>
                    </div>
                </div>`;
        }).join('');
    }

    function setupComments() {
        renderComments();

        if (commentSubmit) {
            commentSubmit.addEventListener('click', () => {
                const name = (commentName?.value || '').trim();
                const text = (commentText?.value || '').trim();

                if (!name || !text) {
                    alert('Please enter your name and comment.');
                    return;
                }
                if (selectedRating === 0) {
                    alert('Please select a rating.');
                    return;
                }

                const comments = loadComments();
                comments.unshift({
                    name,
                    text,
                    rating: selectedRating,
                    date: new Date().toISOString()
                });
                saveComments(comments);
                renderComments();

                // Reset form
                commentName.value = '';
                commentText.value = '';
                selectedRating = 0;
                updateStarDisplay(0);
            });
        }
    }

    // ---- Star Rating ----
    function setupRating() {
        if (!ratingInput) return;
        const stars = ratingInput.querySelectorAll('.td-rating-star');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.star);
                updateStarDisplay(selectedRating);
            });
            star.addEventListener('mouseenter', () => {
                updateStarDisplay(parseInt(star.dataset.star));
            });
        });

        ratingInput.addEventListener('mouseleave', () => {
            updateStarDisplay(selectedRating);
        });
    }

    function updateStarDisplay(rating) {
        if (!ratingInput) return;
        const stars = ratingInput.querySelectorAll('.td-rating-star');
        stars.forEach(star => {
            const val = parseInt(star.dataset.star);
            const icon = star.querySelector('i');
            if (val <= rating) {
                star.classList.add('active');
                icon.className = 'fas fa-star';
            } else {
                star.classList.remove('active');
                icon.className = 'far fa-star';
            }
        });
    }

    // ---- Share ----
    function setupShare() {
        const url = window.location.href;
        const text = currentTirth ? `Explore ${currentTirth.name} — a sacred Jain Tirth Sthal on Saacho Dharm` : '';

        if (shareWhatsapp) {
            shareWhatsapp.addEventListener('click', () => {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
            });
        }
        if (shareTwitter) {
            shareTwitter.addEventListener('click', () => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            });
        }
        if (shareFacebook) {
            shareFacebook.addEventListener('click', () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            });
        }
        if (shareCopy) {
            shareCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(url).then(() => {
                    const origIcon = shareCopy.innerHTML;
                    shareCopy.innerHTML = '<i class="fas fa-check"></i>';
                    shareCopy.style.background = 'rgba(37,211,102,0.15)';
                    shareCopy.style.color = '#25d366';
                    setTimeout(() => {
                        shareCopy.innerHTML = origIcon;
                        shareCopy.style.background = '';
                        shareCopy.style.color = '';
                    }, 2000);
                });
            });
        }
    }

    // ---- Update page meta ----
    function updatePageMeta() {
        if (!currentTirth) return;
        const t = currentTirth;
        const canonicalUrl = `https://saachodharm.com/tirth/${encodeURIComponent(t.id)}`;
        const title = `${t.name} | Jain ${t.type || 'Temple'} in ${t.state || 'India'} | SaachoDharm`;
        const descriptionText = t.shortDescription || `${t.name} — Jain temple details including location, significance, timings, and travel information.`;
        const imageUrl = (t.images && t.images.length > 0)
            ? t.images[0]
            : 'https://saachodharm.com/img/temple_alt.png';

        document.title = title;

        function setMeta(attrName, attrValue, content) {
            let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attrName, attrValue);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        }

        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;

        setMeta('name', 'description', descriptionText);
        setMeta('name', 'keywords', `${t.name}, Jain tirth, ${t.state}, Jain temple, ${t.type}`);
        setMeta('property', 'og:type', 'article');
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', descriptionText);
        setMeta('property', 'og:url', canonicalUrl);
        setMeta('property', 'og:image', imageUrl);
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', descriptionText);
        setMeta('name', 'twitter:image', imageUrl);

        const oldPlaceSchema = document.getElementById('td-place-schema');
        if (oldPlaceSchema) oldPlaceSchema.remove();
        const oldBreadcrumbSchema = document.getElementById('td-breadcrumb-schema');
        if (oldBreadcrumbSchema) oldBreadcrumbSchema.remove();

        const placeSchema = {
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: t.name,
            description: descriptionText,
            image: imageUrl,
            url: canonicalUrl,
            address: {
                '@type': 'PostalAddress',
                addressRegion: t.state || 'India',
                addressCountry: 'IN'
            },
            geo: t.coordinates
                ? {
                    '@type': 'GeoCoordinates',
                    latitude: t.coordinates.lat,
                    longitude: t.coordinates.lng
                }
                : undefined,
            additionalType: t.type || 'Jain Temple'
        };

        const breadcrumbSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://saachodharm.com/'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Tirth Sthal',
                    item: 'https://saachodharm.com/tirth-sthal'
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: t.name,
                    item: canonicalUrl
                }
            ]
        };

        const placeScript = document.createElement('script');
        placeScript.id = 'td-place-schema';
        placeScript.type = 'application/ld+json';
        placeScript.textContent = JSON.stringify(placeSchema);
        document.head.appendChild(placeScript);

        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'td-breadcrumb-schema';
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(breadcrumbScript);
    }

    // ---- Escape HTML ----
    function esc(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', init);
})();
