/**
 * SEO Manager for Dynamic Content
 * Handles dynamic meta tags, schema markup, and SEO optimization for Jain Bhajans
 */

class SEOManager {
  constructor() {
    this.domain = 'https://saachodharm.com';
    this.bhajansPerPage = 12;
    this.initSEO();
  }

  /**
   * Initialize SEO based on current page
   */
  initSEO() {
    const pathname = window.location.pathname;
    
    if (pathname.includes('/bhajans')) {
      this.handleBhajanPageSEO();
    } else if (pathname.includes('/tirth/') || pathname.includes('/tirth-sthal-detail')) {
      this.handleTirthDetailSEO();
    } else if (pathname.includes('/tirth-sthal')) {
      this.handleTirthListingSEO();
    } else if (pathname.includes('/jain-bhajan-lyrics') || pathname.includes('/bhajan/')) {
      this.handleBhajanLyricsSEO();
    } else if (pathname.includes('/calendar')) {
      this.handleCalendarPageSEO();
    } else if (pathname.includes('/about')) {
      this.handleAboutPageSEO();
    } else if (pathname.includes('/contact')) {
      this.handleContactPageSEO();
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
    const cat = params.get('cat');
    const page = params.get('page') || 1;

    if (category) {
      const decodedCategory = decodeURIComponent(category);
      this.updateMetaTags({
        title: `${decodedCategory} - Sacred Jain Bhajans | SaachoDharm`,
        description: `Explore our collection of ${decodedCategory} bhajans. Sacred devotional songs for spiritual growth and meditation.`,
        keywords: `${decodedCategory}, bhajans, Jain devotional songs, spiritual music`,
        url: `${this.domain}/bhajans?category=${category}&page=${page}`
      });

      this.addSchemaMarkup('CollectionPage', {
        name: `${decodedCategory} Bhajans`,
        description: `Collection of ${decodedCategory} devotional bhajans`,
        url: `${this.domain}/bhajans?category=${category}`
      });
    } else {
      this.updateMetaTags({
        title: 'Sacred Bhajans - Devotional Songs for Spiritual Growth | SaachoDharm',
        description: 'Discover a comprehensive collection of Jain bhajans and sacred devotional songs for meditation, prayer, and spiritual development.',
        keywords: 'bhajans, Jain bhajans, devotional songs, sacred music, spiritual songs, devotion',
        url: cat ? `${this.domain}/bhajans?cat=${encodeURIComponent(cat)}&page=${page}` : `${this.domain}/bhajans?page=${page}`
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
   * Handle SEO for Calendar page
   */
  handleCalendarPageSEO() {
    this.updateMetaTags({
      title: 'Jain Panchang \u2014 Sacred Calendar & Festival Dates | SaachoDharm',
      description: 'Interactive Jain calendar with Tithis, Parvs, festivals, Chaumasa dates, Paryushana and Dashlakshan. Navigate months and discover sacred days.',
      keywords: 'Jain calendar, Jain Panchang, Tithi, Parv, Paryushana, Dashlakshan, Chaumasa, Jain festivals',
      url: `${this.domain}/calendar`
    });

    this.addSchemaMarkup('WebPage', {
      name: 'Jain Panchang \u2014 Sacred Calendar',
      description: 'Interactive Jain calendar featuring Tithis, sacred days, and all major Jain festivals'
    });
  }

  /**
   * Handle SEO for Bhajan Lyrics detail page
   */
  handleBhajanLyricsSEO() {
    const params = new URLSearchParams(window.location.search);
    const bhajanId = params.get('bhajan_slug') || params.get('id');
    const bhajanSlug = params.get('bhajan');
    const pathMatch = window.location.pathname.match(/^\/bhajan\/([^/]+)\/?$/i);
    const pathId = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
    const canonicalId = (pathId || bhajanId || bhajanSlug || '').trim();

    if (!canonicalId) {
      this.setRobots('noindex, follow');
      this.addCanonicalTag(`${this.domain}/bhajans`);
      return;
    }

    const readableTitle = canonicalId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    this.updateMetaTags({
      title: `${readableTitle} - Bhajan Lyrics | SaachoDharm`,
      description: `Read the lyrics of ${readableTitle}. Sacred Jain devotional bhajan for spiritual meditation and inner peace.`,
      keywords: `${readableTitle}, bhajan lyrics, Jain devotional, spiritual music`,
      url: `${this.domain}/bhajan/${encodeURIComponent(canonicalId)}`
    });
  }

  /**
   * Handle SEO for Tirth Sthal listing page
   */
  handleTirthListingSEO() {
    this.updateMetaTags({
      title: 'Jain Tirth Sthals & Local Temples in India | SaachoDharm',
      description: 'Explore Jain Tirth Sthals and local Jain temples across India with state-wise discovery, temple details, significance, timings, and how to reach.',
      keywords: 'Jain Tirth Sthal, Jain temples in India, Jain local temples, Jain pilgrimage, Digambar temple, Shwetambar temple',
      url: `${this.domain}/tirth-sthal`
    });

    this.addSchemaMarkup('CollectionPage', {
      name: 'Jain Tirth Sthals & Local Temples',
      description: 'State-wise collection of major Jain pilgrimage sites and local temples in India',
      url: `${this.domain}/tirth-sthal`
    });

    this.addBreadcrumbSchema([
      { name: 'Home', url: `${this.domain}/` },
      { name: 'Tirth Sthal', url: `${this.domain}/tirth-sthal` }
    ]);
  }

  /**
   * Handle SEO for Tirth Sthal detail page
   */
  handleTirthDetailSEO() {
    const params = new URLSearchParams(window.location.search);
    const pathMatch = window.location.pathname.match(/^\/tirth\/([^/]+)\/?$/i);
    const pathId = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
    const id = pathId || params.get('tirth_id') || params.get('id');

    if (!id) {
      this.setRobots('noindex, follow');
      this.addCanonicalTag(`${this.domain}/tirth-sthal`);
      return;
    }

    const readableTitle = id
      ? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : 'Tirth Sthal Details';

    this.updateMetaTags({
      title: `${readableTitle} | Jain Temple Details | SaachoDharm`,
      description: `Read detailed information for ${readableTitle} including history, significance, location, timings, and how to reach.`,
      keywords: `${readableTitle}, Jain temple, Jain tirth, pilgrimage details, Jain history`,
      url: `${this.domain}/tirth/${encodeURIComponent(id)}`
    });

    this.addBreadcrumbSchema([
      { name: 'Home', url: `${this.domain}/` },
      { name: 'Tirth Sthal', url: `${this.domain}/tirth-sthal` },
      { name: readableTitle, url: `${this.domain}/tirth/${encodeURIComponent(id)}` }
    ]);
  }

  setRobots(content) {
    this.updateOrCreateMetaTag('name', 'robots', content);
  }

  /**
   * Handle SEO for About page
   */
  handleAboutPageSEO() {
    this.updateMetaTags({
      title: 'About SaachoDharm - Journey in Jain Spirituality | SaachoDharm',
      description: 'Learn about SaachoDharm - our mission to preserve and share Jain spiritual wisdom, sacred bhajans, and teachings of non-violence (Ahimsa).',
      keywords: 'about SaachoDharm, Jain spirituality, Ahimsa, non-violence, spiritual mission',
      url: `${this.domain}/about`
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
      url: `${this.domain}/contact`
    });

    this.addSchemaMarkup('ContactPage', {
      name: 'Contact SaachoDharm'
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

    // Update canonical link element (not meta tag)
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = data.url;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = data.url;
      document.head.appendChild(canonical);
    }

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
        ? `${this.domain}/bhajans?category=${category}&page=${prevPage}`
        : `${this.domain}/bhajans?page=${prevPage}`;
    }

    paginationObj.nextPage = category
      ? `${this.domain}/bhajans?category=${category}&page=${nextPage}`
      : `${this.domain}/bhajans?page=${nextPage}`;

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
