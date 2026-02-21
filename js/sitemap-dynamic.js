/**
 * Dynamic Sitemap Generator for Jain Bhajans
 * Generates XML sitemap with all bhajans and pages for SEO
 */

class SitemapGenerator {
  constructor() {
    this.baseUrl = 'https://www.saachodharm.com'; // Domain configured
    this.staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/bhajans.html', priority: '0.9', changefreq: 'weekly' },
      { url: '/about.html', priority: '0.7', changefreq: 'monthly' },
      { url: '/calendar.html', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact.html', priority: '0.6', changefreq: 'monthly' },
      { url: '/bhajan-lyrics.html', priority: '0.7', changefreq: 'weekly' }
    ];
    this.initSitemapGenerator();
  }

  /**
   * Initialize sitemap generation
   */
  initSitemapGenerator() {
    // Listen for when data is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.generateSitemapData();
    });
  }

  /**
   * Generate full sitemap data
   */
  async generateSitemapData() {
    try {
      const response = await fetch('data/jainsaar_full_data.json');
      const data = await response.json();
      
      let sitemapEntries = this.getStaticPageEntries();
      sitemapEntries = sitemapEntries.concat(this.getCategoryEntries(data));
      sitemapEntries = sitemapEntries.concat(this.getBhajanEntries(data));
      
      // Generate XML
      const xmlContent = this.generateXML(sitemapEntries);
      
      // Store for download or send to server
      console.log('✓ Sitemap generated with', sitemapEntries.length, 'entries');
      this.storeSitemapData(xmlContent);
      
    } catch (error) {
      console.error('✗ Error generating sitemap:', error);
    }
  }

  /**
   * Get static pages for sitemap
   */
  getStaticPageEntries() {
    return this.staticPages.map(page => ({
      loc: this.baseUrl + page.url,
      lastmod: this.getCurrentDate(),
      changefreq: page.changefreq,
      priority: page.priority
    }));
  }

  /**
   * Get category pages for sitemap
   */
  getCategoryEntries(data) {
    return data.map(category => ({
      loc: `${this.baseUrl}/bhajans.html?category=${encodeURIComponent(category.category)}`,
      lastmod: this.getCurrentDate(),
      changefreq: 'weekly',
      priority: '0.85'
    }));
  }

  /**
   * Get individual bhajan entries for sitemap
   */
  getBhajanEntries(data) {
    const bhajanEntries = [];
    
    data.forEach(category => {
      if (category.items && Array.isArray(category.items)) {
        category.items.forEach(bhajan => {
          const slug = this.generateSlug(bhajan.title);
          bhajanEntries.push({
            loc: `${this.baseUrl}/bhajan/${slug}`,
            lastmod: this.getCurrentDate(),
            changefreq: 'monthly',
            priority: '0.75',
            image: {
              loc: `${this.baseUrl}/images/bhajans/${slug}.jpg`,
              title: bhajan.title,
              caption: category.category
            }
          });
        });
      }
    });
    
    return bhajanEntries;
  }

  /**
   * Generate XML sitemap content
   */
  generateXML(entries) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(entry.loc)}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      
      // Add image if available
      if (entry.image) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${this.escapeXml(entry.image.loc)}</image:loc>\n`;
        if (entry.image.title) xml += `      <image:title>${this.escapeXml(entry.image.title)}</image:title>\n`;
        if (entry.image.caption) xml += `      <image:caption>${this.escapeXml(entry.image.caption)}</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate sitemap index for large sites (optional)
   */
  generateSitemapIndex(sitemapUrls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemapUrls.forEach(url => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Store or display sitemap data
   */
  storeSitemapData(xmlContent) {
    // Store in sessionStorage for reference
    sessionStorage.setItem('sitemapData', xmlContent);
    
    // Log info
    console.log('Sitemap XML size:', xmlContent.length, 'bytes');
    
    // For production: Send to your server to save as sitemap.xml
    // this.sendSitemapToServer(xmlContent);
  }

  /**
   * Send sitemap to server (requires backend endpoint)
   */
  sendSitemapToServer(xmlContent) {
    fetch('/api/save-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: xmlContent
    })
    .then(response => {
      if (response.ok) {
        console.log('✓ Sitemap saved to server');
      } else {
        console.error('✗ Failed to save sitemap');
      }
    })
    .catch(error => console.error('Error sending sitemap:', error));
  }

  /**
   * Generate URL-friendly slug
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
   * Get current date in YYYY-MM-DD format
   */
  getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Escape XML special characters
   */
  escapeXml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Download sitemap as file
   */
  downloadSitemap() {
    const sitemapData = sessionStorage.getItem('sitemapData');
    if (sitemapData) {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(sitemapData));
      element.setAttribute('download', 'sitemap.xml');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  /**
   * Get sitemap data as string
   */
  getSitemapXML() {
    return sessionStorage.getItem('sitemapData');
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.sitemapGenerator = new SitemapGenerator();
  });
} else {
  window.sitemapGenerator = new SitemapGenerator();
}
