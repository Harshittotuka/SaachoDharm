/**
 * SEO Manager for Dynamic Content
 * Handles dynamic meta tags, schema markup, and SEO optimization for Jain Bhajans
 */

class SEOManager {
  constructor() {
    this.domain = 'https://www.saachodharm.com'; // Domain configured
    this.bhajansPerPage = 12;
    this.initSEO();
  }

  /**
   * Initialize SEO based on current page
   */
  initSEO() {
    const pathname = window.location.pathname;
    
    if (pathname.includes('bhajans.html') || pathname.includes('/bhajan/')) {
      this.handleBhajanPageSEO();
    } else if (pathname.includes('tirth-sthal.html')) {
      this.handleTirthStalSEO();
    } else if (pathname.includes('about.html')) {
      this.handleAboutPageSEO();
    } else if (pathname.includes('contact.html')) {
      this.handleContactPageSEO();
    } else if (pathname.includes('gallery.html')) {
      this.handleGallerySEO();
    } else {
      this.handleHomePageSEO();
    }
  }

  /**
   * Handle SEO for Bhajan listing page
   */
  handleBhajanPageSEO() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const page = params.get('page') || 1;

    if (category) {
      const decodedCategory = decodeURIComponent(category);
      this.updateMetaTags({
        title: `${decodedCategory} - Sacred Jain Bhajans | SaachoDharm`,
        description: `Explore our collection of ${decodedCategory} bhajans. Sacred devotional songs for spiritual growth and meditation.`,
        keywords: `${decodedCategory}, bhajans, Jain devotional songs, spiritual music`,
        url: `${this.domain}/bhajans.html?category=${category}&page=${page}`
      });

      this.addSchemaMarkup('CollectionPage', {
        name: `${decodedCategory} Bhajans`,
        description: `Collection of ${decodedCategory} devotional bhajans`,
        url: `${this.domain}/bhajans.html?category=${category}`
      });
    } else {
      this.updateMetaTags({
        title: 'Sacred Bhajans - Devotional Songs for Spiritual Growth | SaachoDharm',
        description: 'Discover a comprehensive collection of Jain bhajans and sacred devotional songs for meditation, prayer, and spiritual development.',
        keywords: 'bhajans, Jain bhajans, devotional songs, sacred music, spiritual songs, devotion',
        url: `${this.domain}/bhajans.html?page=${page}`
      });

      this.addSchemaMarkup('CollectionPage', {
        name: 'All Sacred Bhajans',
        description: 'Complete collection of devotional bhajans for spiritual growth'
      });
    }

    // Add pagination schema
    if (page > 1) {
      this.addPaginationSchema(page, category);
    }
  }

  /**
   * Handle SEO for individual Bhajan detail page
   */
  handleBhajanDetailSEO(bhajan, category) {
    const slug = this.generateSlug(bhajan.title);
    
    this.updateMetaTags({
      title: `${bhajan.title} - ${category} Bhajan | SaachoDharm`,
      description: `Listen to ${bhajan.title}, a sacred ${category} bhajan. ${bhajan.lyrics?.substring(0, 120)}...`,
      keywords: `${bhajan.title}, ${category}, bhajan, devotional, Jain, spiritual`,
      url: `${this.domain}/bhajan/${slug}`
    });

    // Add Music Recording Schema
    this.addSchemaMusicRecording({
      name: bhajan.title,
      artist: 'SaachoDharm',
      category: category,
      description: bhajan.lyrics?.substring(0, 200),
      url: bhajan.link,
      image: `${this.domain}/images/bhajans/${slug}.jpg`
    });

    // Add CreativeWork Schema
    this.addSchemaCreativeWork({
      name: bhajan.title,
      description: `Sacred ${category} bhajan - ${bhajan.title}`,
      author: 'SaachoDharm'
    });
  }

  /**
   * Handle SEO for Tirth Sthal page
   */
  handleTirthStalSEO() {
    this.updateMetaTags({
      title: 'Tirth Sthal - Sacred Pilgrimage Sites | SaachoDharm',
      description: 'Explore sacred Jain pilgrimage destinations (Tirth Sthal) and learn about their spiritual significance in the path of Jainism.',
      keywords: 'Tirth Sthal, pilgrimage sites, Jain temples, sacred places, spiritual destinations',
      url: `${this.domain}/tirth-sthal.html`
    });

    this.addSchemaMarkup('CollectionPage', {
      name: 'Tirth Sthal - Pilgrimage Sites',
      description: 'Collection of sacred Jain pilgrimage destinations'
    });
  }

  /**
   * Handle SEO for About page
   */
  handleAboutPageSEO() {
    this.updateMetaTags({
      title: 'About SaachoDharm - Journey in Jain Spirituality | SaachoDharm',
      description: 'Learn about SaachoDharm - our mission to preserve and share Jain spiritual wisdom, sacred bhajans, and teachings of non-violence (Ahimsa).',
      keywords: 'about SaachoDharm, Jain spirituality, Ahimsa, non-violence, spiritual mission',
      url: `${this.domain}/about.html`
    });

    this.addSchemaMarkup('AboutPage', {
      name: 'About SaachoDharm',
      description: 'Mission and vision of SaachoDharm'
    });
  }

  /**
   * Handle SEO for Contact page
   */
  handleContactPageSEO() {
    this.updateMetaTags({
      title: 'Contact Us - SaachoDharm | Get in Touch',
      description: 'Contact SaachoDharm for inquiries about Jain bhajans, spiritual guidance, or to share feedback about our platform.',
      keywords: 'contact, feedback, inquiry, SaachoDharm, support',
      url: `${this.domain}/contact.html`
    });

    this.addSchemaMarkup('ContactPage', {
      name: 'Contact SaachoDharm'
    });
  }

  /**
   * Handle SEO for Gallery page
   */
  handleGallerySEO() {
    this.updateMetaTags({
      title: 'Gallery - Jain Art & Sacred Imagery | SaachoDharm',
      description: 'Explore our gallery of sacred Jain art, temple imagery, and spiritual photographs celebrating the beauty of Jainism.',
      keywords: 'gallery, Jain art, temple photography, sacred imagery, spiritual pictures',
      url: `${this.domain}/gallery.html`
    });

    this.addSchemaMarkup('ImageGallery', {
      name: 'SaachoDharm Gallery',
      description: 'Collection of sacred Jain art and spiritual imagery'
    });
  }

  /**
   * Handle SEO for Home page
   */
  handleHomePageSEO() {
    this.updateMetaTags({
      title: 'SaachoDharm - Jain Spirituality, Sacred Bhajans & Pilgrimage Guide',
      description: 'Discover the path of Jain Dharma through sacred bhajans, spiritual wisdom, and pilgrimage sites. Explore principles of Ahimsa, truth, and inner peace.',
      keywords: 'Jain Dharma, bhajans, spirituality, Ahimsa, non-violence, pilgrimage',
      url: `${this.domain}/`
    });

    this.addSchemaMarkup('Organization', {
      name: 'SaachoDharm',
      description: 'Platform for Jain spirituality and sacred bhajans'
    });
  }

  /**
   * Update meta tags dynamically
   */
  updateMetaTags(data) {
    // Update or create title
    document.title = data.title;
    this.updateOrCreateMetaTag('name', 'description', data.description);
    this.updateOrCreateMetaTag('name', 'keywords', data.keywords);
    this.updateOrCreateMetaTag('name', 'canonical', data.url);

    // Open Graph tags
    this.updateOrCreateMetaTag('property', 'og:title', data.title);
    this.updateOrCreateMetaTag('property', 'og:description', data.description);
    this.updateOrCreateMetaTag('property', 'og:url', data.url);
    this.updateOrCreateMetaTag('property', 'og:type', 'website');

    // Twitter Card tags
    this.updateOrCreateMetaTag('name', 'twitter:title', data.title);
    this.updateOrCreateMetaTag('name', 'twitter:description', data.description);
    this.updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateOrCreateMetaTag('name', 'twitter:url', data.url);

    console.log('✓ Meta tags updated:', data.title);
  }

  /**
   * Update or create meta tag
   */
  updateOrCreateMetaTag(attrName, attrValue, content) {
    let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  }

  /**
   * Add JSON-LD schema markup
   */
  addSchemaMarkup(type, data) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Add Music Recording Schema
   */
  addSchemaMusicRecording(data) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: data.name,
      description: data.description,
      byArtist: {
        '@type': 'Person',
        name: data.artist
      },
      url: data.url,
      image: data.image,
      keywords: `${data.category}, bhajan, devotional, Jain`
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Add Creative Work Schema
   */
  addSchemaCreativeWork(data) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: data.name,
      description: data.description,
      author: {
        '@type': 'Organization',
        name: data.author
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Add Pagination Schema
   */
  addPaginationSchema(currentPage, category) {
    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;

    const paginationObj = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage'
    };

    if (prevPage > 0) {
      paginationObj.previousPage = category 
        ? `${this.domain}/bhajans.html?category=${category}&page=${prevPage}`
        : `${this.domain}/bhajans.html?page=${prevPage}`;
    }

    paginationObj.nextPage = category
      ? `${this.domain}/bhajans.html?category=${category}&page=${nextPage}`
      : `${this.domain}/bhajans.html?page=${nextPage}`;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(paginationObj);
    document.head.appendChild(script);
  }

  /**
   * Generate URL-friendly slug from text
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Add canonical tag to prevent duplicate content
   */
  addCanonicalTag(url) {
    let canonical = document.head.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    
    canonical.href = url;
  }

  /**
   * Add breadcrumb schema
   */
  addBreadcrumbSchema(breadcrumbs) {
    const items = breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Generate Meta tags for social sharing with image
   */
  generateSocialMeta(title, description, image, url) {
    // Open Graph
    this.updateOrCreateMetaTag('property', 'og:title', title);
    this.updateOrCreateMetaTag('property', 'og:description', description);
    this.updateOrCreateMetaTag('property', 'og:image', image);
    this.updateOrCreateMetaTag('property', 'og:url', url);

    // Twitter Card
    this.updateOrCreateMetaTag('name', 'twitter:title', title);
    this.updateOrCreateMetaTag('name', 'twitter:description', description);
    this.updateOrCreateMetaTag('name', 'twitter:image', image);
    this.updateOrCreateMetaTag('name', 'twitter:url', url);
  }

  /**
   * Add image alt text for SEO
   */
  optimizeImages() {
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      const fileName = img.src.split('/').pop().replace(/\.[^/.]+$/, '');
      img.alt = fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    });
  }
}

// Initialize SEO Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.seoManager = new SEOManager();
  // Optimize images on page load
  setTimeout(() => window.seoManager.optimizeImages(), 1000);
});
